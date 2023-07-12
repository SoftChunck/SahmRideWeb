import React, { useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import {
    Chat,
    Channel,
    ChannelHeader,
    ChannelList,
    MessageList,
    MessageInput,
    Thread,
    Window,
} from 'stream-chat-react';
import '@stream-io/stream-chat-css/dist/css/index.css';
import axios from 'axios';

const filters = { type: 'messaging',members: { $in: ["XkTVtMb1zvN8kOTWTcylYRoLSTA2"] }  };
const options = { state: true, presence: true, limit: 10 };
const sort = { last_message_at: -1 };
const ChatComp = () => {
    const [client, setClient] = useState(null);

    useEffect(() => {
        var users = localStorage.getItem('user')
        users = JSON.parse(users)
        console.log(users)
        const newClient = new StreamChat('z2r8ukcuazvc');

        const handleConnectionChange = ({ online = false }) => {
            if (!online) return console.log('connection lost');
            setClient(newClient);
        };

        newClient.on('connection.changed', handleConnectionChange);
        axios.get('https://gentle-patch-dinosaur.glitch.me/token', {
            responseType: 'json',
            params: { uid: users.uid }
        }).then((token) => {
            newClient.connectUser(
                {
                    id: users.uid,
                    name: users.name,
                    image: users.image
                },
                token.data.token,
            );
            // setClient(newClient)
        })
        return () => {
            newClient.off('connection.changed', handleConnectionChange);
            newClient.disconnectUser().then(() => console.log('connection closed'));
        };
    }, []);

    if (!client) return null;

    return (
        <Chat client={client} >
            <ChannelList filters={filters} sort={sort} options={options} />
            <Channel>
                <Window>
                    <ChannelHeader />
                    <MessageList />
                    <MessageInput />
                </Window>
                <Thread />
            </Channel>
        </Chat>
    );
};

export default ChatComp;