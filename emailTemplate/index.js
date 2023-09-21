


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
            <td height="305" class="bg" style="background: url('https://img.freepik.com/free-photo/business-man-talking-workmates-about-project-planning-strategy-office-person-presenting-analysis-colleagues-company-development-financial-growth-presentation-ideas_482257-40433.jpg?w=1800&t=st=1695287481~exp=1695288081~hmac=41ce6542aff41aea961ac8489d26fdf2871dab96be694d4a68a93f0c91e07bd1'), linear-gradient(rgba(4,171, 180,0.3),rgba(0,0,0,0.9)); background-blend-mode: overlay; background-repeat: no-repeat; background-size: cover; color: #ffffff; width: 100%;  padding-left: 10%;" >
                <div style="padding-top: 130px;">
                   <a href="#">
                    <img src="https://drive.google.com/uc?export=view&id=1hZcXNXms4aUdl2H2mBRpzlwmuW-CJHaa" style="width: 150px;"/>
                    </a>
                </div>
                <h1 class="header-text" style="z-index: 99; font-weight: 600;
            font-size: 24px;
            line-height: 125%;
            text-align: left;">${subject}</h1>
            </td>
        </tr>

        <!--			BODY SECTION-->
        <tr style="height: 455px; background-color: #eee;position: relative;">
            <td>
                <div>
                    <div class="email-body" style="background-color: #ffffff;
            box-shadow: 0px 0px 60px 1px rgba(0, 0, 0, 0.1);
            color: #000000;
            height: auto;
            width: 80%;
            max-width: 480px;
            position: relative;
            top: -118px;
            margin: 0 auto;
            font-size: 16px;
            text-align: left;">
                        <div style="padding: 32px">
                        ${data}
                            <p style="font-family: 'DM Sans'; padding-top: 32px; line-height: 24px;font-size: 16px;">
                                Cheers,
                            </p>
                            <p style="font-family: 'DM Sans'; line-height: 24px;font-size: 16px;">
                                SILO Team
                            </p>
                        </div>
                    </div>
                </div>
            </td>
        </tr>

        <!--FOOTER SECTION-->
        <tr>
            <td style="background-color: #1F3C6B;  padding: 56px 0; font-size: 16px; text-align: center !important">
                <div style="margin: 0 auto;">
                    <p style="padding-top: 12px; color: white">Email: contactus@silo.com</p>
                    <div style="padding-top: 12px">
                      
                    </div>
                </div>
            </td>
        </tr>
    </table>
</div>

</body>
</html>`


}
module.exports = {
   emailTemp
  }