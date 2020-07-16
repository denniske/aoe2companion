
let counter = 0;

export default (req, res) => {
    counter++;
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ name: 'John Doe', counter }))
}