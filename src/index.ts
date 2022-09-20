interface DadosUsuario {
    email:string,
    senha:string,
    mensagens:msgObj[]
}

interface msgObj {
    titulo: string,
    descricao: string,
    msgNum: number,
}

interface UsuarioLogado {
    email:string,
}

function getStorage(key:string):Array<DadosUsuario> {
    return JSON.parse(localStorage.getItem(key) || '[]');
}

function setStorageLogedUser(key:string, usuario:UsuarioLogado):void {
    localStorage.setItem(key, JSON.stringify(usuario));
}

function setStorageNewUser(key:string, usuario:Array<DadosUsuario>):void {
    localStorage.setItem(key, JSON.stringify(usuario));
}

//inicialização
document.addEventListener("DOMContentLoaded", () => localStorage.removeItem("usuarioLogado"));

//--------------------------------------Login---------------------------------------------------------

const inputEmail = document.getElementById('inputEmailIndex') as HTMLInputElement;
const inputSenha = document.getElementById('inputPasswordIndex') as HTMLInputElement;
const btnLogin = document.getElementById('btnLogin') as HTMLButtonElement;
const btnSignin = document.getElementById('btnSignIn') as HTMLButtonElement;

btnLogin.addEventListener('click', logar);

function logar():void{
// validar inputs
    if(validarInputsLogin()){
        //criar key de usuario logado
        const usuarioLogado:UsuarioLogado = { email: inputEmail.value.toLowerCase()};
        setStorageLogedUser('usuarioLogado', usuarioLogado);
        //trocar modais index->home
        location.href='../HTML/home.html';
    } else{
        alertModal('Acesso negado!', 'danger');
    }
}

function validarInputsLogin():boolean{
    //verificar se campos estão preenchidos
    if(!inputEmail.value || !inputSenha.value){
        alertModal ('Favor preencher os campos EMAIL e SENHA.', 'warning');
        return false;
    } 
    //percorrer listaUsuariosStorage e procurar correspondência com email e senha
    const listaUsuariosStorage = getStorage('listaUsuariosStorage');
    const result = listaUsuariosStorage.some((usuario) => usuario.email === inputEmail.value.toLowerCase() && usuario.senha === inputSenha.value);
    if(!result){
        alertModal('Email e/ou senha não conferem', 'warning');
        return false;
    } 
    //se encontrar retorna positivo, senão negativo.
    return result;
}

btnSignin.addEventListener('click', displayCadastro);

function displayCadastro():any{
    const indexModal = document.querySelector('.index') as HTMLDivElement;
    const cadastroModal = document.getElementById('cadastro') as HTMLDivElement;
    let main = document.querySelector('.main');
    const imgEffect = document.querySelector('.imgContainer');
    
    imgEffect?.classList.remove('imgContainer');
    imgEffect?.classList.add('imgContainerActive');

    main?.classList.remove('main')
    main?.classList.add('mainActive')

    indexModal.style.display='none';
    cadastroModal.style.display='block';

    inputEmail.value='';
    inputSenha.value='';
}

//--------------------------------------------------Cadastro---------------------------------------------------

const floatingInputNewEmail = document.getElementById('inputEmailCadastro') as HTMLInputElement;
const floatingInputNewPassword = document.getElementById('inputNewPasswordCadastro') as HTMLInputElement;
const floatingInputRepeatNewPassword = document.getElementById('inputRepeatNewPasswordCadastro') as HTMLInputElement;
const btnCreateNewAccount = document.getElementById('btnCreateNewAccount') as HTMLButtonElement;
const btnReturn = document.getElementById('btnReturn') as HTMLButtonElement;

btnCreateNewAccount.addEventListener('click', createNewAccount);

function createNewAccount():void{
    //verificar inputs
    if(validarInputsCadastro()===false){

        //criar objeto
        const emptyMsg:msgObj = {
            titulo: '',
            descricao: '',
            msgNum: 0
        }

        const novoUsuario:DadosUsuario = {
            email: floatingInputNewEmail.value,
            senha: floatingInputNewPassword.value,
            mensagens: [emptyMsg]
        }

        //getStorage
        const listaUsuariosStorage = getStorage('listaUsuariosStorage');

        //push
        listaUsuariosStorage.push(novoUsuario);

        //setStorage
        setStorageNewUser('listaUsuariosStorage', listaUsuariosStorage);
        displayIndex();
        alertModal('Usuário cadastrado com sucesso!', 'success');
    };
}

function validarInputsCadastro():boolean{
    //percorrer listaUsuariosStorage e procurar correspondência com email
    const listaUsuariosStorage = getStorage('listaUsuariosStorage');
    const result = listaUsuariosStorage.some((usuario) => usuario.email === floatingInputNewEmail.value);
    if(result){
        alertModal('Ops! Email já cadastrado.', 'warning');
        return true;
    }
    if(floatingInputNewPassword.value !== floatingInputRepeatNewPassword.value){
        alertModal('Ops! As senhas informadas não conferem. Por favor, digite novamente.', 'warning');
        return true;
    }
    return false;
}

function displayIndex():any{
    const indexModal = document.querySelector('.index') as HTMLDivElement;
    const cadastroModal = document.getElementById('cadastro') as HTMLDivElement;
    const formEffect = document.querySelector('.mainActive');
    const imgEffect = document.querySelector('.imgContainerActive');

    imgEffect?.classList.remove('imgContainerActive');
    imgEffect?.classList.add('imgContainer');
    formEffect?.classList.remove('mainActive');
    formEffect?.classList.add('main');


    indexModal.style.display='block';
    cadastroModal.style.display='none';

    floatingInputNewEmail.value='';
    floatingInputNewPassword.value='';
    floatingInputRepeatNewPassword.value='';
}

btnReturn.addEventListener('click', displayIndex);

//modal de mensagens
const alertPlaceholder = document.getElementById("liveAlertPlaceholder") as HTMLDivElement;

const alertModal = (message:string, type:string) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      '</div>'
    ].join('');
    alertPlaceholder.append(wrapper);
  }




