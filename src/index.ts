import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import git from 'isomorphic-git';
import path from 'path';
import fs from 'fs';
import http from 'isomorphic-git/http/node';
import pm2 from 'pm2';
import { exec } from 'child_process';

const valid = (key : string) => key == process.env.secret;

const main = async () => {
    const app = express();

    app.use(express.json());

    app.post('/pull', async (req, res) => {
        try {
            const { key, botName } : { key : string, botName : string} = req.body;
            if(!valid(key)) return;

            await git.clone({
                fs,
                http,
                dir: path.join(process.cwd(), '../', botName),
                url: `https://github.com/spartacus04/${botName}`
            });

            await pm2.restart(botName, async (err) => {
                console.log(err);
                await res.sendStatus(500);
            });

            await res.sendStatus(200);
        } catch (error) {
            console.log(error)
        }
        
    });

    app.post('/restart', async (req, res) => {
        try {
            const { key, botName } : { key : string, botName : string} = req.body;
            if(!valid(key)) return;
    
            await pm2.restart(botName, async (err) => {
                console.log(err);
                await res.sendStatus(500);
            });
    
            await res.sendStatus(200);
        } catch (error) {
            console.log(error);
        }
    });

    app.get('/', async (req, res) => {
        await res.sendStatus(200);
    });

    app.listen(3000, () => {
        console.log(process.cwd());
        console.log('https://localhost:3000')
    })
}

main();