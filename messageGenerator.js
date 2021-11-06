
exports.getNotas = (homework, bot, chatId) => {
    let { name, last_name, carrera_conect, curso_conect } = homework;
    bot.sendMessage(chatId, 'Hola ' + name + ' ' + last_name + '!😄 ')
        .then(() => {
            return bot.sendMessage(chatId, 'Es un placer tenerte de vuelta, espero que te este yendo bien en ' + carrera_conect[0].carreraconect_carrera.name_carrera + ' 🧑‍🎓')
        })
        .then(() => {
            let homeworks = {};
            curso_conect.forEach(element => {
                let { name_curso, homework } = element.cursoconect_curso;
                homework.forEach(home => {
                    if (!(name_curso in homeworks)) {
                        homeworks[name_curso] = []
                    }
                    homeworks[name_curso].push(
                        'Tarea: ' + home.name_homework + ' 📝' +
                        '\nDescripción: ' + home.description_homework + ' 🔍' +
                        '\nValor: ' + home.nota_homework + ' 💯' +
                        "\nEstado: " + home.conect_status.name_status +
                        "\nFecha de entrega: " + home.due_date.split('.')[0].replace('T', ' ') + ' 📅'

                    )
                })
            });
            let homeworksMessage = "";
            Object.keys(homeworks).forEach(key => {
                homeworksMessage += '=== *' + key.toUpperCase() + '* ===\n' + homeworks[key].join('\n\n') + "\n--\n";
            })
            if (homeworksMessage.length === 0) {
               return bot.sendMessage(chatId, 'No tienes tareas pendientes 😄 sigue así.')
            } else {
                return bot.sendMessage(chatId, 'Las tareas pendientes son:\n\n ' + homeworksMessage, { parse_mode: 'Markdown' })
            }

        });
}

exports.getCursos=(cursos, bot, chatId)=>{
    let { name, last_name, curso_conect} = cursos;

    bot.sendMessage(chatId, 'Hola ' + name + ' ' + last_name + '!😄 ')
    .then(()=>{
        let cursosMessage = "";
        let i=1;
        curso_conect.forEach(element=>{
            cursosMessage += i+'°  ' + element.cursoconect_curso.name_curso.toUpperCase() + '* \n\n'
            i++;
        })

        if (cursosMessage.length === 0) {
            return bot.sendMessage(chatId, 'No esta asignado a ningun curso 🙃')
         } else {
             return bot.sendMessage(chatId, 'Los cursos a los que esta asignado son:\n\n' + cursosMessage, { parse_mode: 'Markdown' })
         }
    })
  
}