const express = require('express')
const app = express()
const session = require('express-session')
const flash = require('express-flash')
const cookieparser = require('cookie-parser')

app.set('view-engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(session({
    secret: 'paulobrasil33',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 600000 }
}))
app.use(flash());
app.use(cookieparser('paulobrasil33'));
const http = require('http').createServer(app)

const io = require('socket.io')(http)

app.get('/', (req, res) => {
    let erro = req.flash('erro')
    if (erro.length === 0) {
        erro = null
        
    }
    res.render('index.ejs', {erro})
})
app.get('/chat', (req, res) => {
    let nome = req.flash('nome')
    let color = req.flash('color')
    if (nome.length === 0) {
        req.flash('erro', 'uso express-flash para a sessão durar apenas uma requisição, e então apagar a informação salva, se recarregar a pagina do chat você é "deslogado"')
        return res.redirect('/')
    }
    else {
        res.render('chat.ejs', {nome, color})
    }
})
app.post('/pseudocadastro', (req, res) => {
    const nome = req.body.nome
    const color = req.body.color
    const verificar = nome.split('')
    let count = 0
    verificar.forEach(nome => {
        if (nome === '' || nome === ' ') {
            count ++
        }
    })
    if (count === verificar.length) {
        req.flash('erro', 'nome inválido')
        return res.redirect('/')
    }
    if (nome === '' || nome === ' ' || nome === undefined || nome === null || nome.length > 33){ 
        
        req.flash('erro', 'nome inválido')
        return res.redirect('/')
    }
    else {
        req.flash('nome', nome)
        req.flash('color', color)
    }

    res.redirect('/chat')
    
})


io.on('connection', cliente => {
    cliente.on('mensagem', userMensagem => {
        const {user , mensagem, color} = userMensagem
        console.log(userMensagem)
        const acharPalavra = mensagem.split(' ')
        const palavraAchada = []
        acharPalavra.forEach(mensagem => {
            if (mensagem === '' || mensagem.length === 0) {
                return 
                
            }
            if (mensagem === "fg" || mensagem === "lol" || mensagem === "efege") {
                let palavra =  `eu te amo ${mensagem}`

                return palavraAchada.push(palavra)
                
            }
            if (mensagem === "paulo" || mensagem === "Paulo" || mensagem === "paolo" || mensagem === "paulinho") {
                let palavra = `${mensagem} 👺`

                return palavraAchada.push(palavra)

            }
            if (mensagem === "amanda" || mensagem === "Amanda" || mensagem === "haru" || mensagem === "mendoim", mensagem === 'andí', mensagem === 'andi') {
                let palavra = `ande  &#129488`

                return palavraAchada.push(palavra)

            }
            if (mensagem === "faf" || mensagem === "fafo" || mensagem === "alefe") {
                let palavra = `${mensagem} 🥑`

                return palavraAchada.push(palavra)

            }
            if(mensagem === 'amoi') {
                let palavra = `${mensagem} 🥑 &#129488`
                
                return palavraAchada.push(palavra)
            }
            if(mensagem === "gusta" || mensagem === "gustavo" || mensagem === "gustav") {
                let palavra = `ovatsug`

                return palavraAchada.push(palavra)
            }
            if (mensagem === "feio" || mensagem === "horrivel" || mensagem === "horroroso") {
                let palavra = "sem css"
                
                return palavraAchada.push(palavra)
                
            }
            
            else {
                palavraAchada.push(mensagem)
            }
            
        });
        let mensagemFinal = palavraAchada.join(" ")
        let count = 0
        acharPalavra.forEach( mensagem => {
            if (mensagem === "" || mensagem === ' ' || mensagem === '\n') {
                count ++
            }
        })
        if(count === acharPalavra.length) {
            mensagemFinal = 'escrevi só espaços em branco'
        }
        io.emit('renderizarMensagem', {user, mensagem: mensagemFinal, color})
       
    })
})

http.listen(1111)