const $formData = document.getElementById('formData');
const $formDestino = document.getElementById('formDestino');
const $formNovoItem = document.getElementById('formNovoItem');
const $lista = document.querySelector('.lista');
const listaItens = JSON.parse(localStorage.getItem('itens')) || [];

$formData.querySelector('input').value = localStorage.getItem('data');
$formDestino.querySelector('input').value = localStorage.getItem('destino');

if(listaItens.length > 0) {
    listaItens.forEach(item => {
        renderizarItem(item)
    });
} else {
    renderizarErro()
}

$formData.addEventListener('submit', event => {
    event.preventDefault()
    localStorage.setItem('data', event.target[0].value)
})

$formDestino.addEventListener('submit', event => {
    event.preventDefault()
    localStorage.setItem('destino', event.target[0].value)
})

$formNovoItem.addEventListener('submit', event => {
    event.preventDefault()
    const dados = event.target.parentNode.querySelectorAll('input')
    dados[1].value = tratarString(dados[1].value)

    if(dados[1].value) {
        const existe = listaItens.findIndex(itens => itens.nome === dados[1].value)

        if(existe == -1){
            return criarNovoItem(dados)
        }
        return atualizarItem(dados, existe)
    } else {
        alert('O nome informado é inválido!')
    }
})

function criarNovoItem(array) {
    const novoItem = {
        id: listaItens.length > 0 ? listaItens[listaItens.length -1].id + 1 : 0,
        numero: array[0].value,
        nome: array[1].value,
        check: false
    }

    listaItens.push(novoItem)
    atualizarLista()
}

function atualizarItem(dados, index) {
    const item = listaItens[index]
    const itemEditado = {
        id: item.id,
        numero: dados[0].value,
        nome: item.nome,
        check: false
    }
    listaItens.splice(index, 1, itemEditado)
    atualizarLista()
}

function renderizarItem(object) {
    const $item = document.createElement('div')
    $item.setAttribute('id', `item${object.id}`)
    $item.classList.add('item')
    $item.innerHTML = `
        <input type="checkbox" id="${object.id}">
        <label for="${object.id}">
            <div>
                <span>${object.numero}</span>
                <span>${object.nome}</span>
            </div>
        </label>`

    $item.querySelector('label').appendChild(criarBotaoDeletar(object.id))
    $lista.appendChild($item)

    if(object.check) {
        document.getElementById(object.id).checked = true
        document.querySelector(`#item${object.id}`).classList.add('item-ativo')
    }

    document.getElementById(object.id).addEventListener("change", () => {
        atualizaCheckbox(object.id)
    })
}

function criarBotaoDeletar(id) {
    const button = document.createElement('button')
    button.classList.add('btn-deletar')
    button.innerHTML = '<img src="img/delete.svg" alt="Ícone deletar">'

    button.addEventListener('click', () => {
        deletarItem(id)
    })

    return button
}

function limparFormulario() {
    $formNovoItem[0].value = ''
    $formNovoItem[1].value = ''
}

function deletarItem(id) {
    listaItens.splice(listaItens.findIndex(item => item.id === id), 1);
    localStorage.setItem('itens', JSON.stringify(listaItens))
    const $itemDeletado = document.getElementById(`item${id}`)
    $itemDeletado.remove()
    
    if(listaItens.length < 1){
        renderizarErro()
    }
}

function atualizaCheckbox(id){
    const $checkbox = document.getElementById(id)
    const $item = document.getElementById(`item${id}`);

    if($checkbox.checked){
        $item.classList.add('item-ativo')
        listaItens[listaItens.findIndex(item => item.id === id)].check = true
    } else {
        $item.classList.remove('item-ativo')
        listaItens[listaItens.findIndex(item => item.id === id)].check = false
    }

    localStorage.setItem('itens', JSON.stringify(listaItens))
}

function renderizarErro(){
    const template = `<div class="erro">
            <img src="img/Ilustração.png" alt=" Ilustração">
            <h2>Nenhuma tarefa encontrada!</h2>
        </div>`
    $lista.innerHTML = template
}

function atualizarLista() {
    localStorage.setItem('itens', JSON.stringify(listaItens))

    limparFormulario()

    $lista.innerHTML = ''
    listaItens.forEach(item => {
        renderizarItem(item)
    })

    $formNovoItem[0].focus()
}

function tratarString(string) {
    const pattern = /^[a-zA-Z\s]*$/g
    const novaString = string.toLowerCase().trim().match(pattern)

    if(!novaString) {
        return ''
    } else {
        return novaString[0]
    }   
}
