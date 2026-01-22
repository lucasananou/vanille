
const main = async () => {
    try {
        const res = await fetch('http://localhost:5000/store/collections');
        const json = await res.json();
        console.log(JSON.stringify(json, null, 2));
    } catch (e) { console.error(e); }
};
main();
