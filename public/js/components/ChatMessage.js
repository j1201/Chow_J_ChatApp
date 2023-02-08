export default {
    name: 'TheChatMessageComponent',

    props: ['msg'],

    data() {
        return {
            // check to see if the message's socket ID is the same as ours
            // if it is, float to the right
            // else float to the left
            matchedID: this.$parent.socketID == this.msg.message.id
        }
    },

    template: `
    <article class="chat-messages" :class="{ 'other-messages' : matchedID }">
        <div class="user-img-container"><img class="user-img" :src='"images/" + msg.message.img + ".png"' alt="user image" ></div>
        <div class="msg-container">
            <p> {{ msg.message.user }}:</p>
            <h2> {{ msg.message.content }}</h2>
        </div>
    </article>
    `
}