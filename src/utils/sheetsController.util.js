const axios = require("axios");
const axiosUsersUrl = "https://sheet.best/api/sheets/2b502556-55a9-48dd-907b-631d35e4860a/tabs/Users"
const axiosOrdersUrl = "https://sheet.best/api/sheets/2b502556-55a9-48dd-907b-631d35e4860a/tabs/Orders"
const axiosInvoicesUrl = "https://sheet.best/api/sheets/2b502556-55a9-48dd-907b-631d35e4860a/tabs/Orders"


exports.userSheet = async (data, method) => {
  try {
    const response = await axios({
      url: method === "PATCH" ? `${axiosUsersUrl}/IDENTIFIANT/${data.id}` : axiosUsersUrl,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        "IDENTIFIANT": data.id,
        "PANEL ID": data.panel_id,
        "PRENOM": data.first_name,
        "NOM": data.last_name,
        "EMAIL": data.email,
        "TELEPHONE": data.phone,
        "PAYS": data.country,
        "ADRESSE": data.address,
        "VILLE": data.city,
        "CODE POSTAL": data.postal_code,
        "ADRESSE ADD.": data.additional_address,
        "SUSPENDU": data.suspended === 1 ? "OUI" : "NON",
        "CREATION": data.createdAt,
        "EDITION": data.updatedAt
      }
    })
  } catch (error) {
    console.log(error)
  }
}

exports.orderSheet = async (data, method) => {
  try {
    const response = await axios({
      url: method === "PATCH" ? `${axiosOrdersUrl}/IDENTIFIANT/${data.id}` : axiosOrdersUrl,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        "IDENTIFIANT": data.id,
        "ID UTILISATEUR": data.user_id,
        "ID TRANSACTION": data.transaction_id,
        "PRODUIT": data.item,
        "TYPE": data.type,
        "PRIX": data.cost,
        "MONNAIE": data.type === "CREDITS" ? "Euros" : "Credits",
        "STATUS": data.type === "SERVER" ? "COMPLETE" : data.status === "COMPLETE" ? "SUCCES" : data.status === "CANCELLED" ? "ANNULE" : "EN ATTENTE",
        "CREATION": data.createdAt,
        "EDITION": data.updatedAt
      }
    })
  } catch (error) {
    console.log(error)
  }
}

exports.invoiceSheet = async (data, method) => {
  try {
    const response = await axios({
      url: method === "PATCH" ? `${axiosInvoicesUrl}/IDENTIFIANT/${data.id}` : axiosInvoicesUrl,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        "IDENTIFIANT": data.id,
        "ID UTILISATEUR": data.user_id,
        "BASE 64 PDF": data.data,
        "TYPE": data.type,
        "CREATION": data.createdAt,
        "EDITION": data.updatedAt
      }
    })
  } catch (error) {
    console.log(error)
  }
}
