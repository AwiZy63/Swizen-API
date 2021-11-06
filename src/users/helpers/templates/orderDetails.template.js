const randomToken = require('random-token').create('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');

module.exports = orderDetails_html = (item) => {
	const currency = item.type !== 'CREDITS' ? '¤' : '€'
	const orderNumber = item.id;
	const totalPrice = item.cost;
	return `
	<!DOCTYPE html>
<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">

<head>
	<title></title>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
	<!--[if !mso]><!-->
	<link href="https://fonts.googleapis.com/css?family=Abril+Fatface" rel="stylesheet" type="text/css">
	<link href="https://fonts.googleapis.com/css?family=Bitter" rel="stylesheet" type="text/css">
	<link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet" type="text/css">
	<link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" type="text/css">
	<link href="https://fonts.googleapis.com/css?family=Ubuntu" rel="stylesheet" type="text/css">
	<!--<![endif]-->
	<style>
		* {
			box-sizing: border-box;
		}

		body {
			margin: 0;
			padding: 0;
		}

		th.column {
			padding: 0
		}

		a[x-apple-data-detectors] {
			color: inherit !important;
			text-decoration: inherit !important;
		}

		#MessageViewBody a {
			color: inherit;
			text-decoration: none;
		}

		p {
			line-height: inherit
		}

		@media (max-width:520px) {
			.row-content {
				width: 100% !important;
			}

			.stack .column {
				width: 100%;
				display: block;
			}
		}
	</style>
</head>

<body style="background-color: #FFFFFF; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
	<table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF;">
		<tbody>
			<tr>
				<td>
					<table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f3f3f3;" width="500">
										<tbody>
											<tr>
												<th class="column" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px;">
													<table class="heading_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td style="padding-bottom:20px;padding-top:20px;text-align:center;width:100%;">
																<h1 style="margin: 0; color: #555555; direction: ltr; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; font-size: 42px; font-weight: normal; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0;"><strong><span style="color: #333333;">SWI</span><span style="color: #007bfc;">ZEN</span></strong></h1>
															</td>
														</tr>
													</table>
												</th>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="500">
										<tbody>
											<tr>
												<th class="column" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px;">
													<table class="text_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td style="padding-bottom:20px;padding-left:10px;padding-right:10px;padding-top:30px;">
																<div style="font-family: sans-serif">
																	<div style="font-size: 12px; color: #393d47; line-height: 1.2; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif;">
																		<p style="margin: 0; font-size: 12px; text-align: center;"><span style="font-size:38px;color:#333333;"><strong>Résumé de commande</strong></span></p>
																	</div>
																</div>
															</td>
														</tr>
													</table>
													<table class="text_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td style="padding-bottom:20px;padding-left:50px;padding-right:50px;padding-top:10px;">
																<div style="font-family: sans-serif">
																	<div style="font-size: 14px; color: #393d47; line-height: 1.2; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif;">
																		<p style="margin: 0; font-size: 13px; text-align: center;"><span style="font-size:13px;">Vous recevez ce mail car vous venez de commander un article sur le site de <strong>Swizen.eu</strong>.</span></p>
																	</div>
																</div>
															</td>
														</tr>
													</table>
													<table class="divider_block" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td>
																<div align="center">
																	<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																		<tr>
																			<td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #BBBBBB;"><span></span></td>
																		</tr>
																	</table>
																</div>
															</td>
														</tr>
													</table>
													<table class="text_block" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td>
																<div style="font-family: sans-serif">
																	<div style="font-size: 14px; color: #393d47; line-height: 1.2; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif;">
																		<p style="margin: 0; font-size: 14px;"><span style="font-size:16px;"><strong>Commande #${orderNumber} :</strong></span></p>
																	</div>
																</div>
															</td>
														</tr>
													</table>
													<table class="divider_block" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td>
																<div align="center">
																	<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																		<tr>
																			<td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #BBBBBB;"><span></span></td>
																		</tr>
																	</table>
																</div>
															</td>
														</tr>
													</table>
												</th>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table class="row row-3" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="500">
										<tbody>
											<tr>
												<th class="column" width="16.666666666666668%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-left: 5px; padding-right: 5px;">
													<table class="text_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td style="padding-bottom:15px;padding-left:10px;padding-right:10px;padding-top:15px;">
																<div style="font-family: 'Trebuchet MS', Tahoma, sans-serif">
																	<div style="font-size: 14px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; color: #393d47; line-height: 1.2;">
																		<p style="margin: 0; font-size: 14px; text-align: left;"><strong><span style="font-size:14px;">1 x</span></strong></p>
																	</div>
																</div>
															</td>
														</tr>
													</table>
												</th>
												<th class="column" width="58.333333333333336%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top;">
													<table class="text_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td style="padding-bottom:15px;padding-left:10px;padding-right:10px;padding-top:15px;">
																<div style="font-family: sans-serif">
																	<div style="font-size: 12px; color: #393d47; line-height: 1.2; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif;">
																		<p style="margin: 0; font-size: 12px;"><strong><span style="font-size:14px;">${item.type} - ${item.item}</span></strong></p>
																	</div>
																</div>
															</td>
														</tr>
													</table>
												</th>
												<th class="column" width="25%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top;">
													<table class="text_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td style="padding-bottom:15px;padding-left:10px;padding-right:10px;padding-top:15px;">
																<div style="font-family: sans-serif">
																	<div style="font-size: 12px; color: #393d47; line-height: 1.2; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif;">
																		<p style="margin: 0; font-size: 12px; text-align: right;"><strong><span style="font-size:14px;">${item.cost}${currency}</span></strong></p>
																	</div>
																</div>
															</td>
														</tr>
													</table>
												</th>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table class="row row-4" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="500">
										<tbody>
											<tr>
												<th class="column" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px;">
													<table class="divider_block" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td>
																<div align="center">
																	<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																		<tr>
																			<td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #BBBBBB;"><span></span></td>
																		</tr>
																	</table>
																</div>
															</td>
														</tr>
													</table>
													<table class="text_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td style="padding-bottom:40px;padding-left:50px;padding-right:50px;padding-top:10px;">
																<div style="font-family: sans-serif">
																	<div style="font-size: 14px; color: #393d47; line-height: 1.2; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif;">
																		<p style="margin: 0; font-size: 13px; text-align: center;">Merci pour votre achat!</p>
																	</div>
																</div>
															</td>
														</tr>
													</table>
												</th>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table class="row row-5" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f3f3f3;" width="500">
										<tbody>
											<tr>
												<th class="column" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px;">
													<table class="social_block" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td>
																<table class="social-table" width="138px" border="0" cellpadding="0" cellspacing="0" role="presentation" align="center" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																	<tr>
																		<td style="padding:0 7px 0 7px;"><a href="https://www.twitter.com/Swizen_FR" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-blue/twitter@2x.png" width="32" height="32" alt="Twitter" title="twitter" style="display: block; height: auto; border: 0;"></a></td>
																		<td style="padding:0 7px 0 7px;"><a href="https://www.linkedin.com/company/swizen" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-blue/linkedin@2x.png" width="32" height="32" alt="Linkedin" title="linkedin" style="display: block; height: auto; border: 0;"></a></td>
																		<td style="padding:0 7px 0 7px;"><a href="https://www.instagram.com/swizen_france" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-blue/instagram@2x.png" width="32" height="32" alt="Instagram" title="instagram" style="display: block; height: auto; border: 0;"></a></td>
																	</tr>
																</table>
															</td>
														</tr>
													</table>
													<table class="text_block" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td>
																<div style="font-family: sans-serif">
																	<div style="font-size: 14px; color: #393d47; line-height: 1.2; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif;">
																		<p style="margin: 0; font-size: 14px; text-align: center;"><span style="color:#000000;">Swizen <strong>©</strong> 2021 Swizen, tous droits réservés.</span></p>
																	</div>
																</div>
															</td>
														</tr>
													</table>
												</th>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table class="row row-6" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="500">
										<tbody>
											<tr>
												<th class="column" width="33.333333333333336%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; background-color: #f3f3f3;">
													<table class="text_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td style="padding-bottom:15px;padding-left:10px;padding-right:10px;padding-top:15px;">
																<div style="font-family: sans-serif">
																	<div style="font-size: 14px; color: #393d47; line-height: 1.2; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif;">
																		<p style="margin: 0; font-size: 14px; text-align: center;"><span style="color:#a4a4a4;"><a href="https://swizen.eu" target="_blank" style="text-decoration:none;color:#a4a4a4;" rel="noopener">Site web</a></span></p>
																	</div>
																</div>
															</td>
														</tr>
													</table>
												</th>
												<th class="column" width="33.333333333333336%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; background-color: #f3f3f3; border-left: 1px solid #A3A3A3; border-right: 1px solid #A3A3A3;">
													<table class="text_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td style="padding-bottom:15px;padding-left:10px;padding-right:10px;padding-top:15px;">
																<div style="font-family: sans-serif">
																	<div style="font-size: 14px; color: #393d47; line-height: 1.2; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif;">
																		<p style="margin: 0; font-size: 14px; text-align: center;"><span style="color:#a4a4a4;"><a href="https://swizen.eu/documents" target="_blank" style="text-decoration:none;color:#a4a4a4;" rel="noopener">CGV</a></span></p>
																	</div>
																</div>
															</td>
														</tr>
													</table>
												</th>
												<th class="column" width="33.333333333333336%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; background-color: #f3f3f3;">
													<table class="text_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td style="padding-bottom:15px;padding-left:10px;padding-right:10px;padding-top:15px;">
																<div style="font-family: sans-serif">
																	<div style="font-size: 12px; color: #393d47; line-height: 1.2; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif;">
																		<p style="margin: 0; font-size: 12px; text-align: center;"><span style="color:#a4a4a4;"><a href="https://swizen.eu/documents" target="_blank" style="text-decoration:none;color:#a4a4a4;" rel="noopener"><span style="font-size:14px;">CGU</span></a></span></p>
																	</div>
																</div>
															</td>
														</tr>
													</table>
												</th>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table class="row row-7" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f3f3f3;" width="500">
										<tbody>
											<tr>
												<th class="column" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px;">
													<table class="text_block" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td>
																<div style="font-family: sans-serif">
																	<div style="font-size: 12px; color: #393d47; line-height: 1.2; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif;">
																		<p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;">&nbsp;</p>
																	</div>
																	<span style="margin-top: 10px;text-align: center;color: rgba(75,75,75,0);">${randomToken(17)}</span>
																</div>
															</td>
														</tr>
													</table>
												</th>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
				</td>
			</tr>
		</tbody>
	</table><!-- End -->
</body>

</html>
`}