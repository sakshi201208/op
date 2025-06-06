function sendDM(user, message) {
    user.send(message).catch(error => {
        console.error(`Could not send DM to ${user.tag}.\n`, error);
    });
}

module.exports = sendDM;