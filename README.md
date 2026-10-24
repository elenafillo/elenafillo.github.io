# elenafillo.github.io

My personal site: a draggable mindmap home page that links to side projects, publications, and what I'm working on right now.

Plain HTML, CSS and JS. No build step.

## Editing content

- **Text and links:** everything is in [`js/content.js`](js/content.js).
- **Images:** put them in `img/` and reference them as `img/your-file.png` in `content.js`. If a file is missing, the striped placeholder shows instead.
- **Where the mindmap boxes start:** set `pos` on each entry in `SECTIONS`. `{ x: 0.5, y: 0.5 }` is the middle of the screen.

## Running it locally

Open `index.html` in a browser, or serve the folder:

```sh
python -m http.server 8000
# then open http://localhost:8000
```

## Deploying to GitHub Pages

1. On GitHub, create a public repo named **`elenafillo.github.io`**.
2. Push this folder to it:
   ```sh
   git init
   git add .
   git commit -m "First version of the site"
   git branch -M main
   git remote add origin https://github.com/elenafillo/elenafillo.github.io.git
   git push -u origin main
   ```
3. In the repo, go to **Settings → Pages** and set the source to **Deploy from a branch**, branch `main`, folder `/ (root)`.
4. After a minute or so, the site is live at **https://elenafillo.github.io**.
