const socket = require("socket.io");
const supportMessagesController = require("../controllers/support/supportMessages.controller");
const SupportMessage = require("../models/support/supportMessages.model");
const SupportTicket = require("../models/support/supportTickets.model");
const User = require("../models/users/users.model");
const Product = require("../models/products/products.model");
const { clientPanel, panel, webpanel } = require("../../config/database.config");
const { ServiceOrder } = require("../models/services/services.model");
const { Op } = require("sequelize");
const createServer = require("../utils/server-creator.util");
const generateInvoice = require("../utils/invoice-generator.util");
const { sendEmail } = require("../users/helpers/mailer");
const { orderSheet } = require("../utils/sheetsController.util");
const randomToken = require('random-token').create('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');

module.exports.init = (server) => {
    const io = socket(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    //initializing the socket io connection 
    io.on("connection", (socket) => {
        //for a new user send message ticket

        const eventSendNewTicketMessage = async (userId, userPermission, ticketId) => {
            const newMessages = await SupportMessage.findAll({ where: { ticketId: ticketId } })

            io.emit(`responseTicketMessages-${ticketId}`, newMessages)
        };

        const eventUpdateTicketStatus = async (userPermission, ticketId, userId) => {
            const currentTicket = await SupportTicket.findOne({ where: { id: ticketId } });
            const ticketData = {
                isWaiting: currentTicket.userId === userId ? 1 : 0,
                isAnswered: currentTicket.userId === userId ? 0 : 1
            }

            await currentTicket.update(ticketData).then((response) => {
                io.emit('responseTicketStatus', response.dataValues)
            });
        };

        const eventUpdateTicketOpenStatus = async (userPermission, ticketId, userId) => {
            const currentTicket = await SupportTicket.findOne({ where: { id: ticketId } });
            const ticketData = {
                isWaiting: currentTicket.userId === userId ? currentTicket.isWaiting : 0,
            }

            await currentTicket.update(ticketData).then((response) => {
                io.emit('responseTicketOpenStatus', response.dataValues)
            });
        };

        const eventGetServerStatus = async (serverId) => {
            await clientPanel.getServerStatus(serverId).then(res => {
                let serverStatus = res;

                io.emit(`responseServerStatus-${serverId}`, { serverId: serverId, status: serverStatus });
            }).catch(err => {
                let serverStatus = res;
                io.emit(`responseServerStatus-${serverId}`, serverStatus);
            })
        }

        const eventPaypalTransactionCreate = async (transactionId, userId, amount) => {
            const data = {};
            data.transaction_id = transactionId;
            data.user_id = userId;
            data.item = amount;
            data.type = "CREDITS";
            data.cost = amount.toString();

            const newOrder = new ServiceOrder(data);
            await newOrder.save().then(res => {
                orderSheet(res.dataValues, "POST");
            }).catch(err => console.log(error));

            io.emit('paypalOrderCreation', {
                success: true,
                message: "La commande à bien été créée"
            });
        }

        const eventPayPalTransactionConfirm = async (transactionId, userId, status, creditAmount) => {
            const data = {};
            data.transaction_id = transactionId;
            data.user_id = userId;
            data.status = status;
            data.credit_amount = creditAmount;
            data.item = creditAmount;
            
            const transaction = await ServiceOrder.findOne({ where: { [Op.and]: { user_id: data.user_id, transaction_id: data.transaction_id, type: "CREDITS" } } });
            const user = await User.findOne({ where: { id: data.user_id } });

            if (!transaction) {
                io.emit("paypalTransactionStatus", { status: "FAILED", message: "Transaction introuvable." });
            }

            if (!user) {
                io.emit("paypalTransactionStatus", { status: "FAILED", message: "Utilisateur introuvable." });
            }

            const productType = transaction.type;
            const productItem = transaction.item;
            const productCost = transaction.cost;
            
            if (data.status === "COMPLETED") {
                sendEmail(user.email, null, `Résumé de votre commande - ${new Date().toLocaleDateString()}`, 'orderDetails', transaction)
                generateInvoice(
                    user.id,
                    productType,
                    user.first_name,
                    user.last_name,
                    user.address,
                    user.postal_code,
                    user.city,
                    user.country,
                    "EUR",
                    [{
                        "quantity": "1",
                        "description": `${productType} - ${productItem}`,
                        "tax": 0,
                        "price": productCost
                    }],
                    false
                );
                await transaction.update({ status: data.status }).then(res => {
                    orderSheet(res.dataValues, "PATCH");
                }).catch(err => console.log(error));
                await user.update({ wallet: user.wallet + parseInt(data.credit_amount) });
                io.emit("paypalTransactionStatus", { status: "SUCCESS", message: "Transaction effectuée." });
                console.log("Transaction acceptée :", data);
            }
        }

        const eventPayPalTransactionFailed = async (transactionId, userId, status) => {
            const data = {};
            data.transaction_id = transactionId;
            data.user_id = userId;
            data.status = status;

            const transaction = await ServiceOrder.findOne({ where: { [Op.and]: { user_id: data.user_id, transaction_id: data.transaction_id } } });

            if (!transaction) {
                io.emit("paypalTransactionStatus", { status: "FAILED", message: "Transaction introuvable." });
            }

            if (data.status === "FAILED") {
                await transaction.update({ status: data.status }).then(res => {
                    orderSheet(res.dataValues, "PATCH");
                }).catch(err => console.log(error));
                io.emit("paypalTransactionStatus", { status: "ERROR", message: "Transaction echouée." });
            } else if (data.status === "CANCELED") {
                await transaction.update({ status: data.status });
                io.emit("paypalTransactionStatus", { status: "CANCELED", message: "Transaction annulée." });
            }
        }

        /* Nodes allocations status */

        const eventNodesAllocationStatus = async () => {
            const minecraftNodes = await panel.getAllNodes();
            
            let nodeResources = {};
            let productResources = {};
            const products = await Product.findAll();

            products.forEach(async (product) => {
                const data = product.dataValues;
                const productFind = await Product.findOne({ where: { name: data.name } });
                const specs = JSON.parse(product.dataValues.specifics);
                productResources.memory = specs.ram * 1024;
                productResources.disk = specs.storage * 1024;
                for (let i = 0; i < minecraftNodes.data.length; i++) {
                    const minecraftNode = minecraftNodes.data[i];
                    const nodeAllocated = minecraftNode.attributes.allocated_resources;
                    nodeResources.memory = minecraftNode.attributes.memory;
                    nodeResources.disk = minecraftNode.attributes.disk;
                    
                    if (productResources.memory > (nodeResources.memory - nodeAllocated.memory) || productResources.disk > (nodeResources.disk - nodeAllocated.disk)) {
                        if (productFind.stock === 1) {
                            await productFind.update({ stock: 0 });
                            
                            console.log(`Produit ${data.name} n'est plus en stock.`);
                        }
                    } else {
                        if (productFind.stock === 0) {
                            await productFind.update({ stock: 1 });
                            console.log(`Produit ${data.name} est de nouveau en stock.`);
                        }
                    }
                }
            });

            const newProduct = await Product.findAll();

            io.emit('nodesAllocationsStatus', newProduct)
            setTimeout(() => {
                webpanel.query(`SELECT * FROM products`, (err, res) => {
                    if (err) throw err;
                    io.emit('nodesAllocationsStatus', res)
                })
            }, 500)
        }

        /* Server payment + creation */

        const eventBuyGameServer = async (userId, panelId, productId) => {
            const data = {};
            data.user_id = userId;
            data.panel_id = panelId;
            data.product_id = productId;

            const user = await User.findOne({ where: { id: data.user_id } });
            const product = await Product.findOne({ where: { id: data.product_id } });

            let server = {};
            server.offer = product.name;
            server.ownerId = data.panel_id;
            server.specs = JSON.parse(product.specifics);
            server.type = product.type;

            const newServer = await createServer(server.offer, server.ownerId, server.specs.core, server.specs.ram, server.specs.storage, server.specs.database, server.type);

            const productType = "SERVER";
            const productItem = product.name;
            const productCost = product.price;

            const orderData = {
                user_id: user.id,
                transaction_id: randomToken(17),
                item: productItem,
                type: productType,
                cost: productCost,
                status: 'COMPLETED'
            }
            const newOrder = new ServiceOrder(orderData)
            await newOrder.save().then(res => {
                orderSheet(res.dataValues, "POST");
                sendEmail(user.email, null, `Résumé de votre commande - ${new Date().toLocaleDateString()}`, 'orderDetails', res.dataValues);
            }).catch(err => console.log(err));
            if (newServer === "SUCCESS") {
                generateInvoice(
                    user.id,
                    productType,
                    user.first_name,
                    user.last_name,
                    user.address ? user.address : "",
                    user.postal_code ? user.postal_code : "",
                    user.city ? user.city : "",
                    user.country ? user.country : "",
                    "XXX",
                    [{
                        "quantity": "1",
                        "description": `${productType} - ${productItem}`,
                        "tax": 0,
                        "price": productCost
                    }],
                    true
                );
                io.emit("serverCreationStatus", { status: "SUCCESS", message: "Commande effectuée, votre serveur est en cours d'installation." });

                user.update({ wallet: user.wallet - product.price });
            } else if (newServer === "ERROR") {
                io.emit("serverCreationStatus", { status: "ERROR", message: "Une erreur est survenue, veuillez réessayer plus tard." });
            }
        }

        /* Paypal transactions */
        socket.on('createPaypalOrder', eventPaypalTransactionCreate);
        socket.on('confirmPaypalOrder', eventPayPalTransactionConfirm);
        socket.on('failPaypalOrder', eventPayPalTransactionFailed);

        /* Server payment + creation */
        socket.on('createServer', eventBuyGameServer);

        /* Nodes allocations status */
        socket.on('getNodesAllocationsStatus', eventNodesAllocationStatus);
        io.sockets.on('connection', eventNodesAllocationStatus);
        /* Servers status */
        socket.on('getServerStatus', eventGetServerStatus);

        /* Support section */
        socket.on('sendNewTicketMessage', eventSendNewTicketMessage);
        socket.on('updateTicketStatus', eventUpdateTicketStatus);
        socket.on('updateTicketOpenStatus', eventUpdateTicketOpenStatus);
    });
}