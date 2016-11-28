'use strict';

const sendgrid = require('sendgrid')(process.env.MAILER_KEY);

const p = (text) => {
  return `<p style="font-size: 14px; font-family: 'Raleway', sans-serif; font-weight: 400; color: #333;">${text}</p>`;
};

const formatter = (text) => {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Email</title>
    <link href="https://fonts.googleapis.com/css?family=Raleway:200,300,300i,400,400i,700&subset=latin-ext" rel="stylesheet">
  </head>
  <body>
    ${text}
  </body>
  </html>`;
};

const labels = {
  name: 'İsim',
  email: 'Email',
  phone: 'Telefon',
  password: 'Şifre',
  message: 'Mesaj',
  university: 'Üniversite',
  department: 'Bölüm',
  created_at: 'Tarih'
}

const templates = function (temp, body) {
  const temps = {
    submission_create_user: {
      text: `${p('Merhaba,')}${p('Talep formunuz elimize ulaşmıştır. En kısa zamanda uzmanlarımız gerekli çalışmaları yapacak ve size dönüş sağlanacaktır. Bizi tercih ettiğiniz için teşekkür ederiz.')}${p('<span style="font-size: 16px;">WINVESTMENT </span>Ekibi')}`,
      subject: 'Talebiniz alınmıştır'
    },
    submission_create_admin: {
      text: `${p('Yeni talep açıldı.')}`,
      subject: 'Yeni talep'
    },
    contact_create_user: {
      text: `${p('Merhaba,')}${p('İletişim formunuz bize ulaşmıştır. En kısa zamanda ilgili konuyla ilgili size dönüş sağlanacaktır.')}${p('<span style="font-size: 16px;">WINVESTMENT </span>Ekibi')}`,
      subject: 'İletişim formunuz tarafımıza ulaşmıştır'
    },
    contact_create_admin: {
      text: `${p('Yeni iletişim formu oluşturuldu.')}`,
      subject: 'Yeni iletişim formu'
    },
    job_application_user: {
      text: `${p('Merhaba,')}${p('İş başvurunuz bize ulaşmıştır. En kısa zamanda gerekli değerlendirmeler yapılıp size dönüş sağlanacaktır.')}${p('<span style="font-size: 16px;">WINVESTMENT </span>Ekibi')}`,
      subject: 'İş başvurunuz tarafımıza ulaşmıştır'
    },
    job_application_admin: {
      text: `${p('Yeni iş başvurusu alındı.')}`,
      subject: 'Yeni iş başvurusu'
    },
    user_signup: {
      text: `${p('Merhaba,')}${p("Winvestment'a, üye olduğunuz için teşekkür ederiz. Hesabınıza ait bilgileri aşağıda bulabilirsiniz.")}`,
      subject: 'Hoşgeldiniz'
    },
    user_change_password: {
      text: `${p('Merhaba,')}${p('Şifreniz değiştirildi. Hesabınıza ait giriş bilgilerini aşağıda bulabilirsiniz.')}`,
      subject: 'Şifreniz değiştirildi'
    }
  };

  if (body) {
    Object.keys(body).forEach(k => {
      temps.submission_create_admin.text = `${temps.submission_create_admin.text}${p(labels[k] + ': ' + body[k])}`;
      temps.contact_create_admin.text = `${temps.contact_create_admin.text}${p(labels[k] + ': ' + body[k])}`;
      temps.job_application_admin.text = `${temps.job_application_admin.text}${p(labels[k] + ': ' + body[k])}`;
      temps.user_signup.text = `${temps.user_signup.text}${p(labels[k] + ': ' + body[k])}`;
      temps.user_change_password.text = `${temps.user_change_password.text}${p(labels[k] + ': ' + body[k])}`;
    });
  }

  return temps[temp];
};

export function send(t, opts) {
  const toSend = {
    from: process.env.MAILER_FROM_EMAIL,
    fromname: process.env.MAILER_FROM_NAME,
    // text: templates[t].text,
    html: formatter(templates(t, opts.obj).text),
    subject: templates(t).subject,
    to: opts.to
  };

  sendgrid.send(toSend, function (sendGridErr) {
    if (sendGridErr) { console.log(sendGridErr); }
  });
}
