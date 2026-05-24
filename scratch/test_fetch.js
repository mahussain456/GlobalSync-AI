const url = process.argv[2] || 'https://www.globalsync-ai.com/';
fetch(url)
  .then(r => r.text())
  .then(html => {
    console.log('--- HTML Start ---');
    console.log(html.substring(0, 500));
    console.log('--- Root content ---');
    const rootIdx = html.indexOf('<div id="root">');
    if (rootIdx === -1) {
      console.log('No root div found!');
    } else {
      console.log(html.substring(rootIdx, rootIdx + 500));
    }
  })
  .catch(err => console.error(err));
