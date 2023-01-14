import axios from 'axios';

async function submitMessage(form: any): Promise<any>{
    return await axios.post(`/api/messages/create`, form).then(response => response.data );
}

export { submitMessage };