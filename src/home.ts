//get elements
const btnLogOut = document.getElementById('btnLogOut') as HTMLButtonElement;
const inputTitle = document.getElementById('inputTitle') as HTMLInputElement;
const inputDescription = document.getElementById('inputDescription') as HTMLInputElement;
const btnSave = document.getElementById('btnSave') as HTMLButtonElement;

//variaveis globais
interface UsuarioLogado {
    email:string,
}

//funcoes globais
function getStorageUser(key:string):UsuarioLogado {
    return JSON.parse(localStorage.getItem(key) || '[]');
}

function getStorageArray(key:string):Array<DadosUsuario> {
    return JSON.parse(localStorage.getItem(key) || '[]');
}

const logedUser = getStorageUser('usuarioLogado');
const listaUsuariosStorage = getStorageArray('listaUsuariosStorage');

//DOM global
const editInputTitle = document.createElement('input') as HTMLInputElement;
editInputTitle.classList.add('form-control');
editInputTitle.setAttribute('id', 'editInputTitle');

const editInputDescription = document.createElement('input') as HTMLInputElement;
editInputDescription.classList.add('form-control');
editInputDescription.setAttribute('id', 'editInputDescription');

//----------------create table -----------------------
document.addEventListener("DOMContentLoaded", () => {
    if(!logedUser.email){
        alertModalHome('Acesso negado. Por favor, faça o login!', 'danger');
        setTimeout(() => {
            location.href='../HTML/index.html';
        }, 2000);
        
        return;
    }
    criarTabela();
});

function criarTabela():void{
    const userOfList = listaUsuariosStorage.find((user)=>user.email===logedUser.email)!;
    userOfList.mensagens.forEach((note) => printNote(note));
}

//-----------------save-------------------------------
btnSave.addEventListener('click', (event)=>{
    event.preventDefault();

    if(!inputTitle.value){
        alertModalHome('Não é possível salvar uma mensagem sem um título.', 'warning');
        return;
    }
    // salvar msg no Storage
    const userOfList = listaUsuariosStorage.find((user)=>user.email===logedUser.email);
    const checkNum = userOfList?.mensagens.reduce((total,curr)=>total = curr.msgNum+1,0)!;
    const newMsg:msgObj = {
        titulo: inputTitle.value,
        descricao: inputDescription.value,
        msgNum: checkNum
    }
    userOfList?.mensagens.push(newMsg);
    localStorage.setItem('listaUsuariosStorage',JSON.stringify(listaUsuariosStorage));

    //print note
    printNote(newMsg);

    inputTitle.value ='';
    inputDescription.value='';
});

function printNote(note:msgObj){
    //Criar DOM
    const row = document.createElement("tr");
        row.setAttribute('id', `msgNum#${note.msgNum}`);

    const columnNum = document.createElement("td");
        columnNum.setAttribute('class', 'tdNum');

    const columnTitle = document.createElement("td");
        columnTitle.setAttribute('id', `tdTitle#${note.msgNum}`);

    const columnDescription = document.createElement("td");
        columnDescription.setAttribute('id', `tdDescription#${note.msgNum}`)

    const columnAction = document.createElement("td");
        columnAction.setAttribute('id', `tdAction#${note.msgNum}`)

    const btnEditar = document.createElement('button');
    btnEditar.classList.add('btn', 'btn-outline-light', 'me-1');
    btnEditar.setAttribute('id', `btnEditar#${note.msgNum}`);
    btnEditar.innerHTML='Editar';
    btnEditar.addEventListener("click", () => {
        editarMsg(note.msgNum);
    });

    const btnApagar = document.createElement('button');
    btnApagar.classList.add('btn', 'btn-outline-danger');
    btnApagar.setAttribute('id', `btnApagar#${note.msgNum}`);
    btnApagar.innerHTML='Apagar';
    btnApagar.addEventListener("click", () => {
        apagarMsg(note.msgNum);
    });

    //Atribuir valores
    columnNum.innerHTML=String(note.msgNum);
    columnTitle.innerHTML=note.titulo;
    columnDescription.innerHTML=note.descricao;


    //Print in HTML
    const tBody = document.getElementById('tBody') as HTMLTableElement;

    if(note.msgNum>0){
        columnAction.appendChild(btnEditar);
        columnAction.appendChild(btnApagar);
        row.appendChild(columnNum);
        row.appendChild(columnTitle);
        row.appendChild(columnDescription);
        row.appendChild(columnAction);
        tBody.appendChild(row);
    }
}

function editarMsg(msgNum:number):void{
    const tdTitle = document.getElementById(`tdTitle#${msgNum}`) as HTMLTableColElement;
    const tdDescription = document.getElementById(`tdDescription#${msgNum}`)  as HTMLTableColElement;
    const tdAction = document.getElementById(`tdAction#${msgNum}`)
    const btnEditar = document.getElementById(`btnEditar#${msgNum}`) as HTMLButtonElement;
    const btnApagar = document.getElementById(`btnApagar#${msgNum}`) as HTMLButtonElement;

    const btnOk = document.createElement('button');
    btnOk.classList.add('btn', 'btn-outline-success', 'me-1');
    btnOk.setAttribute('id', 'btnOk');
    btnOk.innerHTML='Ok';
    btnOk.addEventListener('click', () => {

        if(!editInputTitle.value){
            alertModalHome('Não é possível salvar uma mensagem sem um título.', 'warning');
            return;    
        }

        tdTitle.removeChild(editInputTitle);
        tdDescription.removeChild(editInputDescription);
        tdAction?.removeChild(btnOk);
        tdAction?.removeChild(btnCancelar);
        tdAction?.appendChild(btnEditar);
        tdAction?.appendChild(btnApagar);

        tdTitle.innerText=editInputTitle.value;
        tdDescription.innerText=editInputDescription.value;
    });

    const btnCancelar = document.createElement('button');
    btnCancelar.classList.add('btn', 'btn-outline-danger');
    btnCancelar.setAttribute('id', 'btnCancelar');
    btnCancelar.innerHTML='Cancelar';
    btnCancelar.addEventListener('click', () => {
        tdTitle.removeChild(editInputTitle);
        tdDescription.removeChild(editInputDescription);
        tdAction?.removeChild(btnOk);
        tdAction?.removeChild(btnCancelar);
        tdAction?.appendChild(btnEditar);
        tdAction?.appendChild(btnApagar);
        
        tdTitle.innerText=tdTitleOriginalText;
        tdDescription.innerText=tdDescriptionOriginalText;
    });

    const tdTitleOriginalText = tdTitle.innerText;
    const tdDescriptionOriginalText = tdDescription.innerText;

    tdTitle.innerHTML=editInputTitle.value=`${tdTitle.innerText}`;
    tdDescription.innerHTML=editInputDescription.value=`${tdDescription.innerText}`;
    
    tdTitle.innerText='';
    tdDescription.innerText='';

    tdTitle?.appendChild(editInputTitle);
    tdDescription?.appendChild(editInputDescription);
    tdAction?.removeChild(btnEditar);
    tdAction?.removeChild(btnApagar);
    tdAction?.appendChild(btnOk);
    tdAction?.appendChild(btnCancelar);
};  

function apagarMsg(msgNum:number):void{
    if (confirm('Tem certeza que deseja apagar esta mensagem?')){
        const userOfList = listaUsuariosStorage.find((user)=>user.email===logedUser.email)!;
        const targetMsgIndex = userOfList.mensagens.findIndex((msg)=>msg.msgNum===msgNum)!;
        userOfList.mensagens.splice(targetMsgIndex,1); 
        document.getElementById(`msgNum#${msgNum}`)?.remove();

        localStorage.setItem('listaUsuariosStorage',JSON.stringify(listaUsuariosStorage));
    };
}

//--------------------------logout-----------------------------------
btnLogOut.addEventListener('click', (event)=>{
    event.preventDefault();
    location.href='../HTML/index.html';
    localStorage.removeItem('usuarioLogado');
});

//Modal----------------------------------------------------
const alertPlaceholderHome = document.getElementById("liveAlertPlaceholderHome") as HTMLDivElement;

const alertModalHome = (message:string, type:string) => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      '</div>'
    ].join('');
    alertPlaceholderHome.append(wrapper);
  }