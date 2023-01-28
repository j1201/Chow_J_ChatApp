export default {
    name: 'TheChatMessageComponent',

    props: ['msg'],

    template: `
    <li>
        <h1> {{ msg.message.user }}</h1>
        <p> {{ msg.message.content}}</p>
    </li>
    `
}