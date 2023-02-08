export default {
    name: 'TheUserBar',

    props: ['userinfo'],

    template: `
    <div class="side-bar">
        <div class="room-name">
            <h2><i class="fa-solid fa-house"></i> Room</h2>
            <p> {{ userinfo[0] }}</p>
        </div>
        <div class="users-list">
            <h2><i class="fa-solid fa-users"></i> Users</h2>
            <p> {{ userinfo[1] }} </p>
        </div>
    </div>
    `
}