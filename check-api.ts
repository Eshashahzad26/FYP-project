import { Client } from '@gradio/client';
import dotenv from 'dotenv';
dotenv.config();

const client = await Client.connect('multimodalart/CatVTON-zerogpu', {
  hf_token: (process.env.HF_TOKEN || undefined) as any
});
console.log(JSON.stringify(await client.view_api(), null, 2));