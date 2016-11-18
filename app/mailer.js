var nodemailer = require('nodemailer'),
    hbs = require('nodemailer-express-handlebars'),
    handlebars = require('express-handlebars'),
    path = require('path');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: process.env.NODEMAILER_SVC,
    auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PW
    }
});

// verify connection configuration
transporter.verify(function(error, success) {
    if (error) {
        console.log('Unable to log in: ' + error);
    } else {
        console.log('Server is ready to take our messages.');
    }
});

// setup e-mail data with unicode symbols
var shopElbaEmail = 'Shop Elba Diaries <shop.elbadiaries@gmail.com>';
var elbaEmail = 'theelbadiaries@gmail.com';

// send mail with defined transport object
var send = function(mailOptions) {

    transporter.use('compile', hbs({
        viewEngine: handlebars.create({}),
        viewPath: path.resolve(__dirname, './mailtmpls')
    }));

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
            throw error;
        }
    });
}

var buildOrderDetailsOptions = function(subject, orderDetails, template) {
    return {
        from: shopElbaEmail,
        to: orderDetails.contactEmail,
        bcc: elbaEmail,
        subject: subject,
        template: template,
        context: {
            orderid : orderDetails._id,
            items : orderDetails.itemList,
            contactname : orderDetails.contactName,
            pickupdate: orderDetails.pickupDate,
            pickuplocation : orderDetails.pickupLocation,
            totalprice : orderDetails.totalPrice,
            contactnumber : orderDetails.contactPhone,
            instructions: orderDetails.instructions,
            status: orderDetails.status
        }
    };
}

var buildInquiryOptions = function(subject, inquiry, template) {
    return {
        from: shopElbaEmail,
        to: inquiry.email,
        bcc: elbaEmail,
        subject: subject,
        template: template,
        context: {
            name: inquiry.name,
            email: inquiry.email,
            type: inquiry.inquiryType,
            message: inquiry.message
        }
    };
}

var buildRegistrationOptions = function(subject, userDetails, template) {
    return {
        from: shopElbaEmail,
        to: userDetails.email,
        bcc: elbaEmail,
        subject: subject,
        template: template,
        context: {
            username: userDetails.local.username,
            email: userDetails.email,
            firstName: userDetails.firstName,
            lastName: userDetails.lastName,
            mobileNumber: userDetails.mobileNumber,
            location: userDetails.location
        }
    };
}

module.exports = {

    mailOrderDetails: function(orderDetails) {
        var subject = "Your Shop Elba Diaries Order " + orderDetails._id,
            mailOptions = buildOrderDetailsOptions(subject, orderDetails, 'orderdetails');

        send(mailOptions, function(err) {
            if (err) {
                console.log("Unable to send orderDetails email: " + err);
                return err;
            }
        });
    },

    mailOrderUpdates: function(orderDetails) {
        var subject = "Your Updated Shop Elba Diaries Order " + orderDetails._id,
            mailOptions = buildOrderDetailsOptions(subject, orderDetails, 'orderupdated');

        send(mailOptions, function(err) {
            if (err) {
                console.log("Unable to send orderDetails email: " + err);
                return err;
            }
        });
    },

    mailOrderCancel: function(orderDetails) {
        var subject = "Cancelled: Shop Elba Diaries Order " + orderDetails._id,
            mailOptions = buildOrderDetailsOptions(subject, orderDetails, 'ordercancelled');

        send(mailOptions, function(err) {
            if (err) {
                console.log("Unable to send orderDetails email: " + err);
                return err;
            }
        });
    },

    mailInquiry: function(inquiry) {
        var senderMailSubject = "Shop Elba Diaries - We got your message!";
        var senderMailOptions = buildInquiryOptions(senderMailSubject, inquiry, 'inquiry');

        //var elbaSubject = "New Inquiry from " + inquiry.name;
        //var elbaMailOptions = buildInquiryOptions(elbaSubject, inquiry, 'inquiry');

        send(senderMailOptions, function(err) {
            if (err) {
                console.log("Unable to send inquiry email: " + err);
                return err;
            }
        });

        //send(elbaMailOptions, function(err) {
        //    if (err) {
        //        console.log("Unable to send inquiry email: " + err);
        //        return err;
        //    }
        //});
    },

    mailUserDetails: function(userDetails) {
        var subject = "Welcome to Shop Elba Diaries!",
            mailOptions = buildRegistrationOptions(subject, userDetails, 'userdetails');

        send(mailOptions, function(err) {
            if (err) {
                console.log("Unable to send user details email: " + err);
                return err;
            }
        });
    }
};
