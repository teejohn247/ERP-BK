


export const emailTemp = (data, subject) => {



// return `<!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
//     <meta http-equiv="X-UA-Compatible" content="ie=edge">
//     <title>Login Invitation Email</title>
//     <link rel="preconnect" href="https://fonts.googleapis.com">
//     <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
//     <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@700&family=Inter:wght@300;400&display=swap"
//           rel="stylesheet">

//     <style>
//         p {
//             margin: 0;
//         }
// <!--        .wrapper {
//             font-family: "Inter";
//             font-size: 0;
//             text-align: center;
//             width: 100%;
//             table-layout: fixed;
//             background-color: #FFFFFF;
//             padding-bottom: 120px;
//         } -->

// <!--         .main {
//             background-color: #ffffff;
//             width: 100%;
//             margin: 0 auto;
//             max-width: 600px;
//             border-spacing: 0;
//             color: #000000;
//             position: relative;
//         } -->

//         .header {
//             text-align: left;
//             vertical-align: top;
//         }

//         .header > td {
//             padding-left: 10%;
//         }

//         .header-text {
//             font-weight: 600;
//             font-size: 32px;
//             line-height: 125%;
//             text-align: left;
//         }
   


//         @media screen and (max-width: 480px) {
//             .header-text {
//                 font-size: 24px;
//             }
//         }

//     </style>
// </head>
// <body>
// <div class="wrapper">
//     <table class="main">
//         <!--	HEADER SECTION		-->
//         <tr class="header">
//             <td height="305" class="bg" style="background-image: url('https://drive.google.com/uc?export=view&id=1aReTn1bJQYUlNdZ0Ja_4xraJpv8Mmikh'), linear-gradient(rgba(0,0,0,0.3),rgba(0,0,0,0.3)); background-blend-mode: overlay; background-repeat: no-repeat; background-size: cover; color: #ffffff; width: 100%; padding-left: 10%; display:flex; justify-content: space-between; background-position: 40% 20%; height: 350px" >
//                 <div style="padding-top: 35px; margin-right:90px; ">
//                    <a href="#">
//                     </a>
                   
//                 </div>
               
//             </td>
//         </tr>

//         <!--			BODY SECTION-->
//         <tr style="height: auto; background-color: white;position: relative;">
//             <td>
//                 <div>
                
//                     <div class="email-body" style="padding: 20px 0px !important;">
//                         <div style="padding-left: 10%; width: 80%;">
                        
//                            <h1 class="header-text" style="z-index: 99; font-weight: 600;
//                             font-size: 24px;
//                             text-align: left !important; margin-bottom: 23px;">${subject}</h1>
//                              ${data}  
//                             <p style= "padding-top: 32px; text-align: left !important; line-height: 24px;font-size: 16px;">
//                                 Cheers,
//                             </p>
//                             <p style=" text-align: left !important; line-height: 24px;font-size: 16px;">
//                                 Silo Team
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//             </td>
//         </tr>

//         <!--FOOTER SECTION-->
//         <tr>
//             <td style="background-color: #04ABB4;  padding: 56px 0; font-size: 16px; text-align: center !important">
//                 <div style="margin: 0 auto;">
//                     <p style="padding-top: 12px; color: white">Email: contactus@silo.com</p>
//                     <div style="padding-top: 12px">
                      
//                     </div>
//                 </div>
//             </td>
//         </tr>
//     </table>
// </div>

// </body>
// </html>`



return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Silo Email Template</title>
</head>

<body>
    <style>
        body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
}
.header {
    background-image: linear-gradient(60deg, rgba(84,58,183,1) 0%, rgba(0,172,193,1) 100%);
    padding: 1rem 0;
    text-align: right;
}
.header-cont {
    margin: 0;
    color: #FFFFFF;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.pad-x {
    padding-left: 8%;
    padding-right: 8%;
}

.header .logo img {
    width: auto;
    height: 4rem;
}
.bell-icon img {
    height: 6rem;
    width: auto;
}
.content {
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
}

@media screen and (max-width: 768px) {

    .header {
        padding: 1rem 0;
    }
    .header .logo img {
        width: auto;
        height: 3rem;
    }

    .bell-icon img {
        height: 4rem;
    }

    .content-wrap .content-title {
        font-size: 1.5rem;
    }

    .content-wrap .name-in {
        font-size: 1rem;
    }

    .content-wrap .butt .button {
        padding: 1.1rem;
    }
}

.content-title {
    font-size: 2rem;
    font-weight: 700;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;   
    margin: 1.5rem 0;
}

.name-in {
    font-size: 1.2rem;
    font-weight: 600;
    font-family: Arial, Helvetica, sans-serif;
    margin: 1rem 0;
}

.content-wrap {
    margin-bottom: 0vw;
    height: auto;
}

.content-wrap .butt {
    padding: 2rem 0;
}

.content-wrap .button {
    background-color: #17395e;
    color: #FFFFFF;
    padding: 1.3rem;
    font-weight: 700;
    text-decoration: none;
    border-radius: 5px;
    transition: ease-out all 0.6s;
}
.content-wrap .button:hover {
    background-color: rgba(66, 133, 244, 1);
}

.salutations {
    padding: 2rem 0;
}

.thanks {
    margin: 1rem 0;
}

.title {
    font-size: 24px;
    margin-bottom: 20px;
}
.body-text {
    margin-bottom: 20px;
}

.footer-cont {
    background-color: #f4f4f4;
    padding-top: 20px;
    padding-bottom: 1.5rem;
    text-align: center;
}

.foot-wrap {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
    gap: 1.3rem;
}

.footer-cont .contact-info {
    margin-top: 0.5rem;
}

.footer-top {
    display: flex;
    align-items: center;
    gap: 2rem;
}

.footer-top .social-links a {
    width: 35px;
    height: 35px;
    display: -webkit-inline-box;
    display: -ms-inline-flexbox;
    display: inline-flex;
    border-radius: 50%;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-transition: all 0.4s ease-in-out;
    transition: all 0.4s ease-in-out;
    font-size: 1rem;
    background-color: #17395e;
    color: #ffffff;
}

.footer-top .social-links svg {
    height: 2rem;
    width: 1rem;
}

.footer-top .social-links a:hover {
    background-color: rgba(66, 133, 244, 1);
    color: #bec0c1;
}

.footer-btm {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    padding-top: 1.5rem;
}

.foot-title {
    display: inline-flex;
    align-items: center;
}

.footer-btm .foot-title .head {
    font-size: 1rem;
    font-weight: 600;
}
.footer-btm .foot-title .sub-head {
    font-size: 0.856rem;
    font-weight: 500;
    color: #808080;
    margin: 0 0.5rem;
}
.footer-btm .foot-title .sub-head a{
    color: #808080;
    text-decoration: none;
    transition: all ease-in-out 0.6s;
}


.footer-btm .contact-info .foot-title .sub-head a:hover {
    color: #17395e;
    text-decoration: underline;
}

.comp-ste .foot-title a {
    font-size: 1rem;
    font-weight: 600;
    font-family: Arial, Helvetica, sans-serif sans-serif;
    color: #3b3131;
    margin: 1rem 0;
    font-style: italic;
    text-decoration: underline;
}

.footer {
    display: flex;
}

    </style>
    <div class="container">
        <div class="header">
            <div class="header-cont pad-x">
                <div class="logo">
                    <img src="https://silo-inc.com/wp-content/uploads/2023/01/White-logo-no-background-Recovered.svg" alt="Silo Logo">
                                <!-- <h1>Silo</h1> -->
                </div>
                            
                <div class="bell-icon">
                    <img src="https://silo-inc.com/wp-content/uploads/2024/05/bell.png" alt="Bell Icon" width="30" height="30">
                </div>
            </div>
            
        </div>
        <div class="content pad-x">
            <div class="content-wrap">
                <div class="content-title">${subject}</div>
                <div class="name-in">Hello, </div>
                <div class="body-text"> ${data}  </div>

                <div class="salutations">
                    <div class="thanks">Thank you,</div>
                    <div class="thanks-te">Silo</div>
                </div>
            </div>
        </div>
        <div class="footer-cont">
            <div class="footer">
                <div class="foot-wrap pad-x">
                    <div class="footer-top">
                        <div class="social-links">
                            <a href="#">
                                <svg xmlns="http://www.w3.org/2000/svg" style="width: 0.65rem;" viewBox="0 0 320 512"><path d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z" fill="#fff"/></svg>
                            </a>
                            <a href="#">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" fill="#fff"/>
                                </svg>
                            </a>
                            <a href="#">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" fill="#fff"/>
                                </svg>
                            </a>
                            <a href="#">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M100.3 448H7.4V148.9h92.9zM53.8 108.1C24.1 108.1 0 83.5 0 53.8a53.8 53.8 0 0 1 107.6 0c0 29.7-24.1 54.3-53.8 54.3zM447.9 448h-92.7V302.4c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.7V448h-92.8V148.9h89.1v40.8h1.3c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3V448z" fill="#fff"/>
                                </svg>
                            </a>
                        </div>
                        <div class="comp-ste">
                            <div class="foot-title"><a href="https://silo-inc.com/" target="_blank">Silo-inc.com</a></div>
                        </div>
                    </div>
                    
                    <div class="footer-btm">
                        <div class="foot-title">
                            <div class="head">Address:</div> 
                            <div class="sub-head">123 Street, City, Country</div>
                        </div>

                        <div class="contact-info">
                            <div class="foot-title">
                                <div class="head">Email:</div> 
                                <div class="sub-head"><a href="mailto:info@silo-inc.com">info@silo-inc.com</a></div>
                            </div>
                            <div class="foot-title">
                                <div class="head">Phone:</div> 
                                <div class="sub-head"><a href="tel:+1234567890">+1234567890</a></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
`

                    // <img src="https://drive.google.com/uc?export=view&id=1hZcXNXms4aUdl2H2mBRpzlwmuW-CJHaa" style="width: 100px;"/>

}
module.exports = {
   emailTemp
  }