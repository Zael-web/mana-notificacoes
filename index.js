const admin = require("firebase-admin");

// 🔑 Credenciais da conta de serviço
const serviceAccount = {
  type: "service_account",
  project_id: "mana-lanches-6455e",
  private_key_id: "a973b4ed682437be53454205be9643554c6854b6",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDyoVpsbEPC37cB\nMerpDK5XwnImvoeIdCfOk/jmLxwOxCM1bRD8Z5YCi48D7LAJOmZrFV+MnxYgoz6i\nuFub9XcRKxlRXvt6Dk1YSx5dlbrkLiwCKw7gJRjnbsNKNPI0uPe1orT1SvV246YN\nF7BzFQ29r82Y6rtFXCSYLuQ66+dkNBstaHBWiopZ6Cui1Yj+HxGgAssikuv9SeE2\n+6wngHr5rMXz//8qvJOK66G+O/DHzkTkqGonyq/DzECXQxkD+UYpwyxTfHXDafQw\n+Biaf771gI6/geUM/lJrYFkbTsUk8MV3/6jTSqiClUDJtkn1rv5KAvcl8/168bfy\ncb6Ik+O5AgMBAAECggEAAp9870QiXWZ2v4QPIpLZBajb/BA+PdrnnUObQr3Ko1w6\ndzblIp1qET/5/VRfONJRTiIOhOIpZpPtNuwgTWjTbzOUk/0fYdvquSQiwWc/fH0F\nS8a0Y/bytHnNka1N2wUO5H9MToSPb8gZQPX7Gdtl6SGP6vHKsX7EBIMpQ3vOZhZm\nuzLgn1QyLc8ILWO5ndZVaIiUx2KtkCV8pAhuj1+Fhvtbl7awzcTcCqHaJu686SXC\njEUp0+dlVvLTMugY6nXWBE1mMEj0HOeYY9WYnZUFOw6ZHXAWKEWsslCUH/YI2UBk\nwnvh54tbo1NAJauH2MyGAeXXNrZSv1SNxDewzC22IwKBgQD8cOS+3EtfrvI7QiA1\n6fk7pBWsCXkxwrFJ940pUR6z9pnMed6Qx98V8czrmsLrvGsH5/tVQFLvCMWxk1mN\nqzi8lXID9YjzYFyRVxWFvnbWTdGhmY9ToZT3me+ahzVfM5QBtyJqhcpVjnAmCxRu\npiH9sL9bItuTYzREyvt1ESeXAwKBgQD2DQ0P49HczNlmMtrmej2YPsaG/dX/TkUz\ng7I56310cpW/dVS7uYZMde3UYxshoXUNpG+e6BwRixcgXZhPWHr9g+gyDmhvd+8b\n4DaZqQnhOEafFrLwriMWh/3dRuX6WEDB/bJJK0LVJVNdQekILUWHlSnqOGCxwrgs\n9W8OE1UPkwKBgAxGpSkO529wv4DYN17H0QHweclS8JzV3e895ZRzyG1x+YqzBnq9\n7YBQsOloLkBuejn5MwSzSxUqtQpsovc7s1egYNoGb7F+JyI+POKzH25OfHpCUHD9\ns5PS3Y8DMjo99N2cfUT22p8MfTGsakLzO0Xt+XBCIrFpKpqJ0G6h9e3nAoGBAODb\nhHhlBsD2JCcVip7eT7P2io+LIiozaWJulE4CO6BTpy5VF56HKYhurW5PM9hEKSjS\ngX+DN0OBDR1y62J3xc4w4d389MwJmuaqvLsok/LS7xcsM1NokIBiv0mdJUbnqCag\npnHfqzAG8Gxlc4UZelUxqCB4bUWGYbIUie0fFbkpAoGAQJz0C6EJlrF1bZf7J1T5\nUWLuHmsdSCbtb7HSCbZcJe+YQDQn8RMTBKeSE7JoV1/lyzoIRkx/ZWzvKBuZmjbp\njB9jBdcTwJjuq1MXTS6oSUi4oeMnpI5m8u83oCz3s5hk4tcA1xVjiIAS6jdX4V6Z\nwL01fQbWl9XQchyG6RCceSU=\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-fbsvc@mana-lanches-6455e.iam.gserviceaccount.com",
  client_id: "106293970762424938342",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40mana-lanches-6455e.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
};

// 🔥 Inicializa Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

console.log("🚀 Servidor Mana Lanches iniciado!");
console.log("👂 Monitorando pedidos no Firestore...");

// 📨 Mensagens por status
const mensagens = {
  "Preparando": {
    title: "🍔 Pedido em preparo!",
    body: (nome) => `${nome}, seu pedido está sendo preparado.`,
  },
  "Saiu para entrega": {
    title: "🚚 Saiu para entrega!",
    body: (nome) => `${nome}, seu pedido está a caminho!`,
  },
  "Entregue": {
    title: "✅ Pedido entregue!",
    body: (nome) => `${nome}, seu pedido foi entregue. Bom apetite!`,
  },
};

// 👂 Escuta mudanças nos pedidos
db.collection("pedidos").onSnapshot((snapshot) => {
  snapshot.docChanges().forEach(async (change) => {
    // Só age em atualizações
    if (change.type !== "modified") return;

    const antes = change.doc.data();
    const depois = change.doc.data();

    const novoStatus = depois.status;
    const nomeCliente = depois.nomeCliente ?? "Cliente";
    const usuarioId = depois.usuarioId;

    if (!usuarioId) {
      console.log("⚠️ Pedido sem usuarioId, pulando...");
      return;
    }

    const msg = mensagens[novoStatus];
    if (!msg) return;

    try {
      // Busca token do cliente
      const usuarioDoc = await db.collection("usuarios").doc(usuarioId).get();

      if (!usuarioDoc.exists) {
        console.log(`⚠️ Usuário ${usuarioId} não encontrado`);
        return;
      }

      const token = usuarioDoc.data().fcmToken;
      if (!token) {
        console.log(`⚠️ Token FCM não encontrado para ${nomeCliente}`);
        return;
      }

      // Envia notificação
      await admin.messaging().send({
        token: token,
        notification: {
          title: msg.title,
          body: msg.body(nomeCliente),
        },
        android: {
  priority: "high",
  notification: {
    sound: "notificacao",
    channelId: "high_importance_channel",
  },
},
        apns: {
          payload: { aps: { contentAvailable: true } },
        },
      });

      console.log(`✅ Notificação enviada: ${nomeCliente} → ${novoStatus}`);
    } catch (err) {
      console.error("❌ Erro ao enviar notificação:", err.message);
    }
  });
});
