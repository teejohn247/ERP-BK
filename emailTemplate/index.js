


export const emailTemp = (data, subject) => {

    // We noticed a new sign-in to your account using ${detectResult.client.name} version ${detectResult.client.version} 
    // <br><br>
    // on a ${detectResult.os.family} version ${detectResult.os.version} ${moment(new Date())} <br><br>

return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Login Invitation Email</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@700&family=Inter:wght@300;400&display=swap"
          rel="stylesheet">

    <style>
        p {
            margin: 0;
        }
<!--         .wrapper {
            font-family: "Inter";
            font-size: 0;
            text-align: center;
            width: 100%;
            table-layout: fixed;
            background-color: #FFFFFF;
            padding-bottom: 120px;
        } -->

<!--         .main {
            background-color: #ffffff;
            width: 100%;
            margin: 0 auto;
            max-width: 600px;
            border-spacing: 0;
            color: #000000;
            position: relative;
        } -->

        .header {
            text-align: left;
            vertical-align: top;
        }

        .header > td {
            padding-left: 10%;
        }

        .header-text {
            font-weight: 600;
            font-size: 32px;
            line-height: 125%;
            text-align: left;
        }
   


        @media screen and (max-width: 480px) {
            .header-text {
                font-size: 24px;
            }
        }

    </style>
</head>
<body>
<div class="wrapper">
    <table class="main">
        <!--	HEADER SECTION		-->
        <tr class="header">
            <td height="305" class="bg" style="background-image: url('https://drive.google.com/uc?export=view&id=1aReTn1bJQYUlNdZ0Ja_4xraJpv8Mmikh'), linear-gradient(rgba(0,0,0,0.3),rgba(0,0,0,0.3)); background-blend-mode: overlay; background-repeat: no-repeat; background-size: cover; color: #ffffff; width: 100%; padding-left: 10%; display:flex; justify-content: space-between; background-position: 40% 20%; height: 350px" >
                <div style="padding-top: 35px; margin-right:90px; ">
                   <a href="#">
                    </a>
                   
                </div>
               
            </td>
        </tr>

        <!--			BODY SECTION-->
        <tr style="height: auto; background-color: white;position: relative;">
            <td>
                <div>
                
                    <div class="email-body" style="padding: 20px 0px !important;">
                        <div style="padding-left: 10%; width: 80%;">
                        
                           <h1 class="header-text" style="z-index: 99; font-weight: 600;
                            font-size: 24px;
                            text-align: left !important; margin-bottom: 23px;">${subject}</h1>
                             ${data}  
                            <p style= "padding-top: 32px; text-align: left !important; line-height: 24px;font-size: 16px;">
                                Cheers,
                            </p>
                            <p style=" text-align: left !important; line-height: 24px;font-size: 16px;">
                                Greenpeg Team
                            </p>
                        </div>
                    </div>
                </div>
            </td>
        </tr>

        <!--FOOTER SECTION-->
        <tr>
            <td style="background-color: #04ABB4;  padding: 56px 0; font-size: 16px; text-align: center !important">
                <div style="margin: 0 auto;">
                    <p style="padding-top: 12px; color: white">Email: contactus@Greenpeg.com</p>
                    <div style="padding-top: 12px">
                      
                    </div>
                </div>
            </td>
        </tr>
    </table>
</div>

</body>
</html>`

                    // <img src="https://drive.google.com/uc?export=view&id=1hZcXNXms4aUdl2H2mBRpzlwmuW-CJHaa" style="width: 100px;"/>

}
module.exports = {
   emailTemp
  }