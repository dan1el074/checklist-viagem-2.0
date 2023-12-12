const $formData = document.getElementById('formData');
const $formDestino = document.getElementById('formDestino');
const $formNovoItem = document.getElementById('formNovoItem');
const $lista = document.querySelector('.lista');
const $erro = document.querySelector('.erro')
const listaItens = JSON.parse(localStorage.getItem('itens')) || [];

$formData.querySelector('input').value = localStorage.getItem('data')
$formDestino.querySelector('input').value = localStorage.getItem('destino')

if(listaItens) {
    listaItens.forEach(item => {
        renderizarItem(item)
    });
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
    // TODO: se ouver um item com o mesmo nome, atualizar ele!
    // if(buscar no "array.nome" se já tem um "dados[1].value"){
        criarNovoItem(dados)
    // } else {
    //     atualizaItem(dados)
    // }
})

function criarNovoItem(array) {
    const novoItem = {
        id: listaItens.length > 0 ? listaItens[listaItens.length -1].id + 1 : 0,
        numero: array[0].value,
        nome: array[1].value,
        check: false
    }

    limparFormulario()

    listaItens.push(novoItem)
    localStorage.setItem('itens', JSON.stringify(listaItens))

    $lista.innerHTML = ''
    listaItens.forEach(item => {
        renderizarItem(item)
    })

    $formNovoItem[0].focus()
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

    $erro.remove()
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
    //TODO: se remover o último item, voltar com a imagem de erro!
    // ou mudar a lógica pra ele aparecer quando o "listaItens" estiver vazio
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
