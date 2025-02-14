Este é um projeto [Next.js](https://nextjs.org) inicializado com [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Começando

Primeiro, execute o servidor de desenvolvimento:

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev
```

Abra [http://localhost:3000](http://localhost:3000) com seu navegador para ver o resultado.

Você pode começar a editar a página modificando `app/page.tsx`. A página é atualizada automaticamente conforme você edita o arquivo.

Este projeto usa [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) para otimizar e carregar automaticamente [Geist](https://vercel.com/font), uma nova família de fontes para Vercel.

## Saiba Mais

Para saber mais sobre Next.js, veja os seguintes recursos:

- [Documentação do Next.js](https://nextjs.org/docs) - aprenda sobre os recursos e API do Next.js.
- [Aprenda Next.js](https://nextjs.org/learn) - um tutorial interativo de Next.js.

Você pode conferir [o repositório do Next.js no GitHub](https://github.com/vercel/next.js) - seu feedback e contribuições são bem-vindos!

## Implantação no Vercel

A maneira mais fácil de implantar seu aplicativo Next.js é usar a [Plataforma Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) dos criadores do Next.js.

Confira nossa [documentação de implantação do Next.js](https://nextjs.org/docs/app/building-your-application/deploying) para mais detalhes.

---

# Como Instalar o Capacitor no Seu Projeto React Native

## Introdução

Neste guia, você aprenderá como instalar e configurar o Capacitor no seu projeto React Native. O Capacitor é uma ferramenta útil para gerenciar dependências e sincronizar as plataformas Android e iOS. Com ele, você poderá compilar e testar o seu aplicativo com facilidade.

## Requisitos do Sistema

Antes de começar, verifique se o seu sistema tem os seguintes requisitos:

- Node.js Versão 20 ou superior
- Yarn Versão 2 ou superior
- React Native Versão 0.69 ou superior

## Instalação do Capacitor

Para instalar o Capacitor no seu projeto, execute os seguintes comandos no terminal:

```bash
npx cap init XClinic com.xclinic.app
```

Isso criará um novo projeto React Native chamado `XClinic`. Agora, você pode adicionar as plataformas Android e iOS:

```bash
npx cap add android
npx cap add ios
```

## Configuração do Capacitor

Depois de adicionar as plataformas, você precisa configurar o Capacitor para que ele funcione corretamente. Para fazer isso, execute o seguinte comando no terminal:

```bash
npx cap check
```

Isso verificará se todas as dependências estão instaladas e configuradas corretamente. Se houver algum erro, você pode usar o comando `npx cap fix` para resolvê-lo.

## Sincronização das Dependências

Para sincronizar as dependências do Capacitor, execute o seguinte comando no terminal:

```bash
npx cap sync
```

Isso sincronizará as dependências da plataforma Android e iOS com as versões mais recentes.

## Abrir Projeto em Editores de Desenvolvimento

Para abrir o projeto no editor de desenvolvimento, execute o seguinte comando no terminal:

```bash
npx cap open android
npx cap open ios
```

Isso abrirá o projeto no Android Studio ou no Xcode, respectivamente. Agora, você pode compilar e testar o seu aplicativo com facilidade.

## Comandos Adicionais

Aqui estão alguns comandos adicionais que podem ser úteis:

```bash
npx cap copy
# Copia os arquivos web para as plataformas nativas

npx cap update
# Atualiza as dependências do Capacitor para a versão mais recente

npx cap doctor
# Verifica a configuração do projeto e sugere correções
```

## Conclusão

Você conseguiu instalar e configurar o Capacitor no seu projeto React Native! Agora, você pode compilar e testar o seu aplicativo com facilidade. Se tiver algum problema durante a instalação ou configuração, não hesite em perguntar na comunidade do React Native ou no GitHub. Boa sorte com o seu projeto!

