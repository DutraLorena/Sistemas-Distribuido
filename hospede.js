  
var mqtt = require('mqtt')
var client  = mqtt.connect({ host: 'localhost', port: 8888 })

const readline = require('readline');
const { exception } = require('console');
const { STATUS_CODES } = require('http');
const cli_id = "cli:"

client.on('connect', function () {

  var readlineSync = require('readline-sync');

  console.log("Menu: ", menu);
  console.log("Escolha o quarto que deseja se hospedar: ");

  while (true) {
    input = readlineSync.prompt();
    console.log('Resevar o quarto? ');
    if (input > menu.length-1){
      console.log('Tente novamente.');
    } else {
      client.publish('order-init', cli_id + JSON.stringify(menu[input]));
    }
    
  }
  console.log('Adicionando ao carrinho.');

  client.publish('list-order', cli_id);
  
  client.publish('end-order', cli_id);
  
  client.end();
});

client.on('message', function(topic, message){
  
  const CHART_LIST = 'list-order';
  const END_ORDER = 'end-order';

  var message_str = message.toString()
  var check = true
  
  if (message_str.substring(0, 4) == cli_id) {
    check = false
  } else {
    message_str = message_str.substring(4)
  }

  if (check) {
    switch(topic) {
      case CHART_LIST:
        // const list = JSON.parse(message);
        console.log('O quarto escolhido: ', message_str);
        break;
      case END_ORDER:
        console.log(message_str)
        break;
    }   
  }
});

//Base de Dados dos quartos
const menu  = [
  {id: '0',
   name: 'Quarto1',
   itens : 1,
   preço: 'R$ 100',
   descrição : ['cama de solteiro','ar condicionado','tv]
  },
   
  {id: '1',
   name: 'Quarto2',
   itens : 2,
   preço: 'R$ 200',
   descrição : ['cama de solteiro','quarto compartilhado', 'ar condicionad', 'tv a cabo']
  },
   
  {id: '2',
   name: 'Quarto3',
   itens : 3,
   preço: 'R$ 300',
   descrição : ['cama de casal','quarto reservado', 'ar condicionado','tv a cabo', ]
  },
   
  {id: '3',
   name: 'Quarto4',
   itens : 4,
   preço: 'R$ 400',
   descrição : ['cama de casal','quarto reservado', 'ar condicionado','tv a cabo', 'serviço de quarto']
  },
 ]

client.subscribe('list-order', function(err) {
  if (!err){
    console.log("Subscrito em 'list-order'");
    };
});

  
client.subscribe('end-order', function(err) {
  if (!err){
    console.log("Subscrito em 'end-order'");
    };
  });
