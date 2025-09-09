// backend/controllers/chatController.js
const { prisma } = require("../config/database");


async function getChat(req, res, next) {
  try {
    const projectId = req.params.id;
    const messages = await prisma.message.findMany({
      where: { project_id: projectId },
      orderBy: { created_at: "asc" },
    });
    res.json({ messages });
  } catch (error) {
    next(error);
  }
}


async function postChatMessage(req, res, next) {
  try {
    const { recipientId, content } = req.body;
    const projectId = req.params.id;
    
   
    if (!recipientId || !content) {
      return res.status(400).json({ error: "Missing required fields" });
    }

  
    const msg = await prisma.message.create({
      data: {
        sender_id: req.user.id,
        recipient_id: recipientId,
        project_id: projectId,
        content,
      },
    });

    
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { title: true }
    });

   
    req.app.locals.io.to(`user_${recipientId}`).emit("newMessage", {
      ...msg,
      projectTitle: project.title
    });

    
    await prisma.notification.create({
      data: {
        user_id: recipientId,
        title: "New chat message",
        message: `New message in ${project.title}`,
        type: "message",
        metadata: { 
          projectId,
          messageId: msg.id,
          senderId: req.user.id,
          projectTitle: project.title
        },
      },
    });

    res.status(201).json({ message: msg });
  } catch (error) {
    next(error);
  }
}
async function getConversations(req, res, next) {
  try {
    const userId = req.user.id;
    
    const conversations = await prisma.message.findMany({
      where: {
        OR: [
          { sender_id: userId },
          { recipient_id: userId }
        ]
      },
      select: {
        project: {
          select: { id: true, title: true }
        },
        sender: {
          select: { id: true, first_name: true, last_name: true }
        },
        recipient: {
          select: { id: true, first_name: true, last_name: true }
        },
        content: true,
        created_at: true,
        project_id: true
      },
      distinct: ['project_id'],
      orderBy: { created_at: 'desc' }
    });

    
    const formatted = conversations.map(conv => ({
      projectId: conv.project.id,
      projectTitle: conv.project.title,
      otherParticipant: {
        id: conv.sender.id === userId ? conv.recipient.id : conv.sender.id,
        name: conv.sender.id === userId 
          ? `${conv.recipient.first_name} ${conv.recipient.last_name}`
          : `${conv.sender.first_name} ${conv.sender.last_name}`
      },
      lastMessage: {
        content: conv.content,
        timestamp: conv.created_at
      }
    }));

    res.json({ conversations: formatted });
  } catch (error) {
    next(error);
  }
}

module.exports = { getChat, postChatMessage, getConversations };
