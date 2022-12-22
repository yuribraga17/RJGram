import type { NextApiRequest, NextApiResponse } from 'next';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import type  {respostaPadraoMsg} from '../../types/respostaPadraoMsg';
import md5 from 'md5';
import { UsuarioModel } from '../../models/UsuarioModel';

const endpointLogin = async (
    req : NextApiRequest,
    res : NextApiResponse<RespostaPadraoMsg>
) => {
    if(req.method === 'POST'){
        const {login, senha} = req.body;

        const usuariosEncontrados = await UsuarioModel.find({email : login, senha : md5(senha)});
        if(usuariosEncontrados && usuariosEncontrados.length > 0){
            const usuarioEncontrado = usuariosEncontrados[0];
            return res.status(200).json({msg : `Seja bem vindo ${usuarioEncontrado.nome}!`});
        }
        return res.status(400).json({erro : 'Usuário ou senha invalido'});
    }
    return res.status(405).json({erro : 'Metodo de validação invalido'});
}
export default conectarMongoDB(endpointLogin);

