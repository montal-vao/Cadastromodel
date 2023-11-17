
const KEY_BD = "@userestudent"

var recordList = {
    ultimoIdGerado:0, usuarios:[]
}

var FILTRO = ''

function gravarBD(){
    localStorage.setItem(KEY_BD, JSON.stringify(recordList))
}

function lerBD(){
    const data = localStorage.getItem(KEY_BD)
    if(data){
        recordList = JSON.parse(data)
    }
    desenhar()
}

function pesquisar(value){
    FILTRO = value;
    desenhar()
}

function desenhar(){
    const tbody = document.getElementById("recordListBody")
    if(tbody){
        var data = recordList.usuarios
        if(FILTRO.trim()){
            const expReg = eval(`/${FILTRO.trim().replace(/[^\d\w]+/g,'.*')}/i`)
            data = data.filter(usuario => {
                return expReg.test( usuario.name ) || expReg.test( usuario.fone )
            })
        
        }
        data = data
        .sort((a, b) => {
           return a.name < b.name ? -1 : 1
        })
        .map( usuario => {
            return `<tr>
                    <td>${usuario.id}</td>
                    <td>${usuario.name}</td>
                    <td>${usuario.fone}</td>
                    <td>
                        <button onclick='vizualizar("register",false,${usuario.id})'>Editar</button>
                        <button class='vermelho' onclick='excluirDeletar(${usuario.id})'>Deletar</button>
                    </tr>
            </tr>`
        })
        tbody.innerHTML = data.join('')
    }
}

function insertUser(name, fone){
    const id = recordList.ultimoIdGerado + 1;
    recordList.ultimoIdGerado = id;
    recordList.usuarios.push({
        id, name, fone
    })
    gravarBD()
    desenhar()
    vizualizar("list")

}

function editUser(id, name, fone){
    var usuario = recordList.usuarios.find( usuario => usuario.id == id)
    usuario.name = name;
    usuario.fone = fone;
    gravarBD()
    desenhar()
    vizualizar('list')

}

function deleteUser(id){
    recordList.usuarios = recordList.usuarios.filter( usuario => {
        return usuario.id != id
    })
    gravarBD()
    desenhar()

}

function excluirDeletar(id){
    if(confirm('Tem certeza que deseja excluir o ID' + id)){
        deleteUser(id)
        desenhar()
    }
}

function limpEdit(){
    document.getElementById('name').value = ''
    document.getElementById('fone').value = ''
}

function vizualizar(pagina, novo=false, id=null){
    document.body.setAttribute('page',pagina)
    if(pagina === "register"){
        document.getElementById("name").focus()
        if(novo) limpEdit()
        if(id){
            const usuario = recordList.usuarios.find( usuario => usuario.id == id)
            if(usuario){
                document.getElementById('id').value = usuario.id
                document.getElementById('name').value = usuario.name 
                document.getElementById('fone').value = usuario.fone 
            }
        }
        document.getElementById('fone').focus()
    }
}

function submeter(e){
    e.preventDefault()
    const data = {
        id: document.getElementById('id').value,
        name: document.getElementById('name').value,
        fone: document.getElementById('fone').value
    }
    if(data.id){
        editUser(data.id, data.name, data.fone)        
    }else{
       insertUser(data.name, data.fone) 
    } 
    
    alert("ok")
    

}

window.addEventListener("load", () => {
    lerBD()

    document.getElementById("registration").addEventListener("submit", submeter)
    document.getElementById("inputPesquisa").addEventListener("keyup", e => {
        pesquisar(e.target.value)
    })
})