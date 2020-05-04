// Abrir e fechar carrinho
const botaoCarrinho = document.querySelector('[data-modal="open"]')
const botaoFechar = document.querySelector('[data-modal="close"]')
const modal = document.querySelector('.shopping-cart-hover')

const campoProduto = document.querySelector('#campo')
const ItensParaCompra = document.querySelectorAll(".section-products-content-items .item-produt-image-hover > a")
const modalCompra = document.querySelector('.list-products')
const notificationItens = document.querySelector('.notification-text');

sessionStorage.setItem('carrinho', JSON.stringify([]));
sessionStorage.setItem('totalItens', JSON.stringify(0));

//produtos que viriam da API por exemplo
const produtos = [
  { id: '1', nome: 'Lorem ipsum dolor summit', selecionado: 1, total: 99.99, valor: 99.99, imagem: './images/new-4.png' },
  { id: '2', nome: 'Lorem ipsum dolor summit', selecionado: 1, total: 99.99, valor: 99.99, imagem: './images/new-3.png' },
  { id: '3', nome: 'Lorem ipsum dolor summit', selecionado: 1, total: 99.99, valor: 99.99, imagem: './images/new-1.png' },
  { id: '4', nome: 'Lorem ipsum dolor summit', selecionado: 1, total: 99.99, valor: 99.99, imagem: './images/new-2.png' },
  { id: '5', nome: 'Lorem ipsum dolor summit', selecionado: 1, total: 99.99, valor: 99.99, imagem: './images/new-4.png' },
  { id: '6', nome: 'Lorem ipsum dolor summit', selecionado: 1, total: 99.99, valor: 99.99, imagem: './images/new-3.png' },
  { id: '7', nome: 'Lorem ipsum dolor summit', selecionado: 1, total: 99.99, valor: 99.99, imagem: './images/new-1.png' },
  { id: '9', nome: 'Lorem ipsum dolor summit', selecionado: 1, total: 99.99, valor: 99.99, imagem: './images/new-4.png' },
  { id: '10', nome: 'Lorem ipsum dolor summit', selecionado: 1, total: 99.99, valor: 99.99, imagem: './images/new-3.png' },
  { id: '11', nome: 'Lorem ipsum dolor summit', selecionado: 1, total: 99.99, valor: 99.99, imagem: './images/new-1.png' },
  { id: '12', nome: 'Lorem ipsum dolor summit', selecionado: 1, total: 99.99, valor: 99.99, imagem: './images/new-2.png' }]


function Notificacao(funcao, valor) {
  let item = JSON.parse(sessionStorage.getItem('totalItens'));
  if (funcao == 'somar') {
    setandoValorNotificacao(item + valor);
  } else if('reset') {
    setandoValorNotificacao(valor);
  } else {
    setandoValorNotificacao(item - valor);
  }
  notificationItens.innerText = JSON.parse(sessionStorage.getItem('totalItens'));

}

function setandoValorNotificacao(valor) {
  sessionStorage.setItem('totalItens', JSON.stringify(valor));
}

function abrirCarrinho(event) {
  event.preventDefault()
  modal.classList.add('active')
}

function fecharCarrinho(event) {
  event.preventDefault()
  modal.classList.remove('active')
}

botaoCarrinho.addEventListener('click', abrirCarrinho)
botaoFechar.addEventListener('click', fecharCarrinho)



//função para pegar um produto no carrinho
function pegarDentroDoCarrinho(id) {
  let carrinho = pegarCarrinho();
  let verificandoSeOItemExisteNoCarrinho = carrinho.find(item => item.id == id);

  return verificandoSeOItemExisteNoCarrinho;
}
//Função para pegar o Carrinho
function pegarCarrinho() {
  return JSON.parse(sessionStorage.getItem('carrinho'));
}
//função para setar um item no Carrinho
function adicionarItemCarrinho(objeto) {

  Notificacao('somar', 1);
  let carrinho = pegarCarrinho();
  let verificandoSeOItemExisteNoCarrinho = pegarDentroDoCarrinho(objeto.id);

  if (verificandoSeOItemExisteNoCarrinho) {
    let newCarrinho = carrinho.map(item => {
      if (item.id == objeto.id) {
        item.total = (Number(item.total) + objeto.valor).toFixed(2);
        item.selecionado++;
      }
      return item;
    });

    carrinho = newCarrinho;
  } else {

    carrinho.push(objeto);
  }

  sessionStorage.setItem('carrinho', JSON.stringify(carrinho));
}
//Função para deletar um item no Carrinho
function removerItemCarrinho(id, delecaoCompleta) {
  let carrinho = pegarCarrinho();
  let produto = pegarDentroDoCarrinho(id);
  Notificacao('subtrair', 1);
  if (delecaoCompleta) {
    let newCarrinho = [];
    newCarrinho = carrinho.filter(item => item.id != id);
    carrinho = newCarrinho == undefined ? [] : newCarrinho;
    sessionStorage.setItem('carrinho', JSON.stringify(carrinho));
    let soma = 0;

    if (carrinho.length) {
      carrinho.forEach((item) => {
        soma += item.selecionado;
      })
    }

    Notificacao('reset', soma);
    atualizarProdutoAoCarrinhoHTML();
    return;
  }

  if (produto.selecionado > 1) {

    let newCarrinho = carrinho.map(item => {
      if (item.id == produto.id) {
        item.total = (item.total - produto.valor).toFixed(2);
        item.selecionado--;
      }
      return item;
    });

    carrinho = newCarrinho;
  } else {
    let newCarrinho = carrinho.filter(item => item.id != id);
    carrinho = newCarrinho;
  }

  sessionStorage.setItem('carrinho', JSON.stringify(carrinho));
}


// Função para pegar apenas um produto basedo no ID
function PegandoProduto(id) {
  return produtos.find(product => product.id == id);
}

function adicionandoProdutoAoCarrinhoHTML(produto) {
  let item =
    `<div class="product-shopping-cart row">
    <img style="max-width: 72px;" src="${produto.imagem}" alt="Produto Carrinho" class="column">
    <div class="product-description column">
      <p> ${produto.nome} </p>
      <p> (Azul, P) </p>
      <p> R$ ${String(produto.valor).replace(".", ",")} </p>
      <input type="text" value="${produto.selecionado}" id="campo">
      <input type="button" id="add-${produto.id}" class="add" value="+">
      <input type="button" id="sub-${produto.id}" class="sub" value="-">
    </div>
    <div class="product-price-delete column">
      <p> R$ ${String(produto.total).replace(".", ",")} </p>
      <img src="./images/excluir.svg" id="delete-${produto.id}" alt="Excluir Produto">
    </div>
  </div>`;

  modalCompra.insertAdjacentHTML('beforeend', item);

  const deletarBotao = document.querySelector(`#delete-${produto.id}`);
  deletarBotao.addEventListener('click', (e) => {
    e.preventDefault();
    removerItemCarrinho(produto.id, true);
  })

  const addBotao = document.querySelector(`#add-${produto.id}`);
  addBotao.addEventListener('click', (e) => {
    e.preventDefault();
    //DRY - Dont Repeat Yourself
    adicionarItemCarrinho(produto);
    atualizarProdutoAoCarrinhoHTML()
  });

  const removeBotao = document.querySelector(`#sub-${produto.id}`);
  removeBotao.addEventListener('click', (e) => {
    e.preventDefault();
    //DRY - Dont Repeat Yourself
    removerItemCarrinho(produto.id)
    atualizarProdutoAoCarrinhoHTML()
  });

}

function atualizarProdutoAoCarrinhoHTML() {
  let carrinho = pegarCarrinho();
  modalCompra.innerHTML = '';
  carrinho.forEach(produto => {
    adicionandoProdutoAoCarrinhoHTML(produto);
  });
}

function aumentaValor() {
  campoProduto.value = 1
  campoProduto.value = parseInt(campoProduto.value) + 1;
}

function diminuiValor() {
  campoProduto.value = parseInt(campoProduto.value) - 1;
}

campoProduto.addEventListener('onclick', aumentaValor)
// campoProduto.addEventListener('onclick', diminuiValor)

//Adicionado produtos ao carrinho
ItensParaCompra.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    let produto = PegandoProduto(item.getAttribute('data-id'))
    let ExisteNoCarrinho = pegarDentroDoCarrinho(produto.id);
    adicionarItemCarrinho(produto);

    if (ExisteNoCarrinho) {
      atualizarProdutoAoCarrinhoHTML()
    } else {
      adicionandoProdutoAoCarrinhoHTML(produto);
    }

  });

});