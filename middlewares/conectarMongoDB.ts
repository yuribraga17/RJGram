import type {NextApiRequest, NextApiResponse, NextApiHandler} from 'next';
import mongoose from 'mongoose';
import type {respostaPadraoMsg} from '../types/respostaPadraoMsg';

export const conectarMongoDB = (handler : NextApiHandler) =>
    async (req: NextApiRequest, res: NextApiResponse<respostaPadraoMsg>) => {

    // Verificar se a database esta conectada, se sim, seguir pro endpoint 
    // ou proximo midleware
    if(mongoose.connections[0].readyState){
        return handler(req, res);
    }
    
    // Não conectou, obter variavel de ambiente preenchida do env.
    const {DB_CONEXAO_STRING} = process.env;
    
    //Env vazia, abortar uso e enviar aviso ao dev Yuri.
    if(!DB_CONEXAO_STRING){
        return res.status(500).json({ erro : 'ENV de configuração de database incorreta.'});
    }

    mongoose.connection.on('connected', () => console.log('Banco de dados conectado'));
    mongoose.connection.on('error', erro => console.log(`Ocorreu erro ao conectar no banco: ${error}`));
    await mongoose.connect(DB_CONEXAO_STRING);
    
    //Seguir para o endpoit, conexão efetuada na database.
    return handler(req, res);
}