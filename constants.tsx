
import { QuizStep, StepType } from './types';

export const QUIZ_STEPS: QuizStep[] = [
  {
    id: 1,
    type: StepType.INTRO,
    title: '✨ Vamos revelar o que está por trás dos seus caminhos fechados ✨',
    text: 'Axé, meu filho. Axé, minha filha. 🙏\nEste não é um teste comum.\n\nAqui, vamos olhar para os sinais da sua vida, para entender se existe um desalinhamento espiritual que pode estar bloqueando sua prosperidade, seus relacionamentos e sua paz.\n\nResponda com sinceridade.\nOs Orixás falam através da verdade.',
    buttonLabel: '👉 Começar agora'
  },
  {
    id: 2,
    type: StepType.QUESTION,
    question: 'Você sente que sua vida parece andar em círculos, mesmo se esforçando?',
    options: [
      { id: 'circles', label: '🔁 Sim, os mesmos problemas sempre voltam' },
      { id: 'trapped', label: '⚠️ Às vezes melhora, mas logo trava de novo' },
      { id: 'hard', label: '😔 Me esforço muito e quase nunca dá certo' },
      { id: 'flows', label: '🌱 Não, minha vida flui bem' }
    ]
  },
  {
    id: 3,
    type: StepType.QUESTION,
    question: 'Em qual dessas áreas você sente que algo não flui como deveria?',
    multiple: true,
    maxSelections: 2,
    options: [
      { id: 'money', label: '💰 Dinheiro e prosperidade' },
      { id: 'love', label: '❤️ Relacionamentos amorosos' },
      { id: 'peace', label: '🧠 Paz interior / ansiedade' },
      { id: 'protection', label: '🛡️ Proteção espiritual' },
      { id: 'everything', label: '🔄 Tudo parece travado ao mesmo tempo' }
    ],
    buttonLabel: 'Continuar jornada'
  },
  {
    id: 4,
    type: StepType.TRANSITION,
    title: '⚠️ Isso é importante você entender agora',
    text: 'Se você respondeu que sente bloqueios ou repetições… a culpa não é sua.\n\nNa maioria dos casos, não é falta de fé. Não é azar. E nem castigo.\n\nMuitas pessoas vivem desalinhadas espiritualmente, sem saber quem as rege — e acabam pedindo ajuda para a força errada… ou nenhuma.\n\n👉 Respira. Vamos continuar.',
    buttonLabel: '➡️ Seguir'
  },
  {
    id: 5,
    type: StepType.QUESTION,
    question: 'Você sabia que, dentro da tradição dos Orixás, cada pessoa nasce sob a regência de uma força espiritual específica?',
    options: [
      { id: 'no', label: '😮 Não sabia disso' },
      { id: 'heard', label: '🤔 Já ouvi falar, mas nunca entendi direito' },
      { id: 'yes', label: '🧿 Sim, acredito muito nisso' },
      { id: 'doubt', label: '⚠️ Tenho dúvidas, mas estou aberto(a)' }
    ]
  },
  {
    id: 6,
    type: StepType.QUESTION,
    question: 'Você sente que, mesmo acreditando em Deus ou nos Orixás, algo parece fora do lugar na sua vida?',
    options: [
      { id: 'out_of_place', label: '⚠️ Sim, sinto que estou desalinhado(a)' },
      { id: 'maybe', label: '🤔 Às vezes, não sei explicar' },
      { id: 'alone', label: '😔 Sinto que estou sozinho(a) espiritualmente' },
      { id: 'aligned', label: '🌿 Não, me sinto totalmente alinhado(a)' }
    ]
  },
  {
    id: 7,
    type: StepType.QUESTION,
    question: 'Quando você faz uma oração ou pedido, você sente que é ouvido(a)?',
    options: [
      { id: 'sometimes', label: '🙏 Às vezes sim, às vezes não' },
      { id: 'rarely', label: '😞 Quase nunca vejo resultado' },
      { id: 'nothing', label: '🔄 Parece que sempre peço, mas nada muda' },
      { id: 'always', label: '🌟 Sim, sempre sinto resposta' }
    ]
  },
  {
    id: 8,
    type: StepType.TRANSITION,
    title: '🕯️ Isso não é coincidência',
    text: 'Dentro das tradições espirituais mais antigas, existe uma lei clara:\n\n👉 Cada pessoa nasce sob a regência de um Orixá específico.\n\nEssa força não muda. Não se escolhe. Ela vem com você desde o nascimento.\n\nQuando você não sabe quem te rege, vive tentando se conectar… mas nunca chega na fonte certa.',
    buttonLabel: '➡️ Continuar'
  },
  {
    id: 9,
    type: StepType.QUESTION,
    question: 'Você sabia que a sua data de nascimento carrega o padrão espiritual do seu Orixá?',
    options: [
      { id: 'clueless', label: '😮 Não fazia ideia' },
      { id: 'explains', label: '🤯 Isso explica muita coisa…' },
      { id: 'heard_of', label: '🧿 Já ouvi falar, mas nunca confirmei' },
      { id: 'suspected', label: '⚠️ Sempre desconfiei disso' }
    ]
  },
  {
    id: 10,
    type: StepType.DATE_INPUT,
    question: 'Para seguir com a leitura espiritual, informe sua data de nascimento:',
    subtitle: 'Essa informação não é usada para cálculos comuns. Ela é a base do padrão espiritual que te rege desde o nascimento.',
    buttonLabel: 'Consultar Padrão Espiritual'
  },
  {
    id: 11,
    type: StepType.LOADING_ANALYSIS,
    title: '🔮 Analisando seu padrão espiritual...',
    text: 'Com base na sua data de nascimento, o seu padrão espiritual está sendo identificado.\n\nOs sinais apontam para uma regência clara. Mas existe um detalhe importante…\n\n👉 Nem toda revelação pode ser feita sem o ritual correto.'
  },
  {
    id: 12,
    type: StepType.TRANSITION,
    title: '🧿 Sobre quem faz essa leitura',
    text: 'Essa análise segue os fundamentos do jogo de búzios, utilizado há séculos dentro do Candomblé.\n\nO processo é guiado por um Babalorixá com mais de 30 anos de estrada, respeitando a tradição, o axé e a lei da troca espiritual.\n\nIsso não é teste automático. É um caminho sério.',
    buttonLabel: '➡️ Ver diagnóstico preliminar'
  },
  {
    id: 13,
    type: StepType.PRE_REVELATION,
    title: '✨ Seu Orixá já foi identificado ✨',
    text: 'De acordo com o seu padrão espiritual, existe um Orixá específico que rege a sua vida.\n\nEssa força explica por que alguns caminhos travam, por que certas áreas não fluem e onde está a chave da sua prosperidade.\n\n⚠️ Mas a revelação do nome do seu Orixá e do ponto de conexão só pode ser feita após a conclusão do ritual espiritual.'
  }
];
