import type { NextApiRequest, NextApiResponse } from 'next';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import type { respostaPadraoMsg } from '../../types/respostaPadraoMsg';
import type { loginResposta } from '../../types/LoginResposta';
import md5 from 'md5';
import { UsuarioModel } from '../../models/UsuarioModel';
import jwt from 'jsonwebtoken'

const endpointLogin = async (
    req : NextApiRequest,
    res : NextApiResponse<respostaPadraoMsg | loginResposta>
) => {
    
    const {MINHA_CHAVE_JWT} = process.env;
    if(!MINHA_CHAVE_JWT){
        return res.status(500).json({erro : 'ENV Jwt não informada'});
    }

    if(req.method === 'POST'){
        const {login, senha} = req.body;

        const usuariosEncontrados = await UsuarioModel.find({email : login, senha : md5(senha)});
        if(usuariosEncontrados && usuariosEncontrados.length > 0){
            const usuarioEncontrado = usuariosEncontrados[0];

            const token = jwt.sign({_id : usuarioEncontrado._id}, MINHA_CHAVE_JWT);
            return res.status(200).json({
                nome : usuarioEncontrado.nome, 
                email : usuarioEncontrado.email, 
                token});
        }
        return res.status(400).json({erro : 'Usuário ou senha invalido'});
    }
    return res.status(405).json({erro : 'Metodo de validação invalido'});
}
export default conectarMongoDB(endpointLogin);

