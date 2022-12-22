import type { NextApiRequest, NextApiResponse } from 'next';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import type  { respostaPadraoMsg } from '../../types/respostaPadraoMsg';
import type  { CadastroRequisicao } from '../../types/CadastroRequisicao';
import { UsuarioModel } from '../../models/UsuarioModel';
import md5 from 'md5';

const endpointCadastro = 
    async (req : NextApiRequest, res : NextApiResponse<respostaPadraoMsg>) => {

        if(req.method === 'POST'){
            const usuario = req.body as CadastroRequisicao;
        
            if(!usuario.nome || usuario.nome.length < 2){
                return res.status(400).json({erro : 'Nome invalido'});
            }
    
            if(!usuario.email || usuario.email.length < 5
                || !usuario.email.includes('@')
                || !usuario.email.includes('.')){
                return res.status(400).json({erro : 'Email invalido'});
            }
    
            if(!usuario.senha || usuario.senha.length < 4){
                return res.status(400).json({erro : 'Senha invalida'});
            }
            //salvar database
            const UsuarioASerSalvo = {
                nome : usuario.nome,
                email : usuario.email,
                senha : md5(usuario.senha),

            }
            //Validação de usuário com mesmo email
            const usuariosComMesmoEmail = await UsuarioModel.find({email : usuario.email});
            if(usuariosComMesmoEmail && usuariosComMesmoEmail.length > 0){
                return res.status(400).json({erro : 'Ops: O email cadastrado em nossa rede social.'});
            }

            await UsuarioModel.create(UsuarioASerSalvo);

            return res.status(200).json({msg : 'Conta criada com sucesso.'});
        }
        return res.status(405).json({erro : 'Modo de utilização invalido'});
}

export default conectarMongoDB(endpointCadastro);