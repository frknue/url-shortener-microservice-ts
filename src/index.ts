import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { connectToDB, insertURL, findURL} from './libs/db';

const app = express();

app.use(express.static(process.cwd() + '/public'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function validateURL(url: string): boolean {
    // Only allow http and https
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return false;
    }
    return true;
}

app.get('/', (req: Request, res: Response) => {
    res.sendFile(process.cwd() + '/public/index.html');
});

app.post('/api/shorturl', async (req: Request, res: Response) => {
    const url = req.body.url;
    if (!validateURL(url)) {
        res.json({ error: 'invalid url' });
    }
    const doc = await insertURL(url);

    res.json(doc);
});

app.get("/api/shorturl/:short_url", (req: Request, res: Response) => {
    const shortURL = req.params.short_url;
    // find url and redirect
    findURL(shortURL).then((doc) => {
        if (doc) {
            res.redirect(doc.original_url);
        } else {
            res.json({ error: 'invalid url' });
        }
    });
});


app.listen(3000, () => {
    console.log('Server running on port 3000');
});
