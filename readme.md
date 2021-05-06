# Configurando cliente do axios

00:12 Instala Axios, cria pasta services e dentro dela página api.
00:35 Cria constante para instanciar o axios com a base URL com localhost:3333.

01:14 Começa a fazer a requisição de login no contexto com um post na rota session.

02:41 Se o login for realizado com sucesso retornará os dados do usuário incluindo token e refresh token.

04:00 Explicar sobre as partes de um token JWT

- JWT segue uma estrutura padrão que fica dividido em:

  - Header -> Nessa parte fica algumas configurações como protocolo de encriptação e tipo do token.

  - Payload -> Corpo do token, onde deve ser retornado todos os dados relevantes ao usuário. Lembrando que não se deve trazer dados sensiveis como senhas, numero de cartão e etc.

  - Verify Signature -> Quando um token é gerado, junto a ele vem uma secret key que valida a autenticidade do token. Ela fica salva no servidor, de forma privada.

# Salvando dados de um usuário

00:32 -> Cria a estrura de dados para armazenar usuário e cria uma tipagem para tal.

02:28 -> Armazena os dados do usuário após a requisição ser um sucesso!

03:01 -> Cria página Dashboard

03:10 -> Redireciona o usuário

04:12 -> Retorna dados do usuário do contexto e ajusta a tipagem

05:01 -> Ajusta lógica do isAuthenticated

05:36 -> Imprime dados do usuário na dashboard

08:16 -> Explicar diferença entre sessionStorage, localStorage e Cookies

# Salvando tokens nos cookies

- Opção de lidar com cookies com fácil integração com o next\*

00:34 -> instalar nookies -> pega função setCookie

01:50 -> Explicando variaveis que a função setCookie recebe e informações adicionais

03:30 -> Explica sobre o 4º parametro da função

# Recuperando estado da autenticação

00:42 -> Cria useEffect para pegar dados do usuário quando a tela renderizar(caso exista nos cookies é claro)

02:22 -> Função parseCookies do nookies -> cria verificação

04:22 explicando sobre enviar tokens nas requisições -> Ajusta em services/api

06:00 -> Preenche dados no user

10:00 -> Atualiza token após pegar dados da requisição com api.defaults.headers

# Realizando refresh do token

00:18 -> Diminuir tempo dos tokens para 10 segundos.

01:10 -> Fala sobre interceptos do axios para interceptar as requisições.
-> Você pode interceptar tanto uma request quanto uma response.
-> Primeiro parametro da função: "O que eu quero fazer se a resposta der sucesso"
-> Segundo parametro da função: "O que eu quero fazer se ocorrer algum erro"
-> Axios possui uma tipagem de AxiosError para os interceptors

05:50 -> Pega Refresh token quando a requisição tiver status 401 e um code token.expired para então fazer a requisição de refreshToken na rota post /refresh enviando o refreshToken e pegando o token do response.data.

06:00 -> Atualiza token após funcionar

11:47 -> Quando o interceptor identificar que o token estiver espirado, ele irá pausar todas as requisições até o token ser atualizado. Após isso, executar as requisições. (Fila de requisição);

# Fila de requisições no Axios

00:45 -> Cria variavel isRefreshing e faz condição para acontecer só uma vez a requisição de refresh

01:58 -> retorna uma nova promisse e o Axios não suporta um assync portanto justificando o retorno de uma promisse.

02:42 -> Cria uma variavel pra armazenar todas as requests que falharam.

04:50 -> pega error.config que tem todas as informações das requisições que falharam

06:45 -> Quando terminar de fazer refresh(finally) vai voltar o isRefreshing para false e se a requisição tiver funcionando, vamos pegar cada requisição que falhou e chamar elas novamente passando o token numa função configurada anteriormente na promise.
Após isso limpar lista.
Se tiver erro chamando a função de failure

# Realizando logout automático

01:40: Importa destroyCookie e começa a criar logistica para fazer logou automático.

03:00 Faz uma trativa de error na dashboard

04:00 Ajusta interceptors quando não for erro de token expired, destroi os cookies e redireciona para página inicial. E no axios interceptors, no final dos ifs é impotante caso não pasase em nenhuma condição, retornar o erro do axios.

# Recuperando token no server-side

01:05 -> Faz metódo getServerSideProps na page login fazendo a verificação se o usuário ta logado ou não.

02:43 -> Nookies funcionam do lado do servidor, porém dessa vez colocamos o contexto pois estamos no servidor :D

03:42 -> Se o token existe, redirectiona pra dashboard e isso não é permanente

# Validando visitante

00:30 -> Cria uma pasta utils com um arquivo withSSRGuest para páginas que só podem ser acessadas por visitantes/não logadas. Essa função vai ficar dentro do getServerSideProps. Essa função recebe uma outra função como parametro com o formato GetServerSideProps.

02:50 -> Utiliza um high order funcion para retornar uma outra função(No caso a do getServerSideProps), o contexto é do tipo GetServerSidePropsContext

high order funcion uma função que pode retornar uma função ou receber uma função e executar uma função

04:35 -> Se usuário não tiver autenticado, retorna função que recebeu como parametro. Da pra falar que o retorno da função é uma Promise do tipo GetServerSideResult.
