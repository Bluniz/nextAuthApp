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
