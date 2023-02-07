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
        <h2> {{ msg.message.user }} says: </h2>
        <p> {{ msg.message.content }}</p>
    </article>
    `
}