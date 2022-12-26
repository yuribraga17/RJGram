import type {NextApiResponse} from 'next';
import type {respostaPadraoMsg} from '../../types/respostaPadraoMsg';
import nc from 'next-connect';
import {updload, uploadImagemCosmic} from '../../services/uploadImagemCosmic';
import {conectarMongoDB} from '../../middlewares/conectarMongoDB';
import {validarTokenJWT} from '../../middlewares/validarTokenJWT';

const handler = nc()
    .use(updload.single('file'))
    .post( async (req : any, res : NextApiResponse<respostaPadraoMsg>) => {
        try{
            if(!req || !req.body){
                return res.status(400).json({erro : 'Parametros de entrada não informados'});
            }

            const {descricao} = req?.body;

            if(!descricao || descricao.length < 2){
                return res.status(400).json({erro : 'Descrição invalida'});
            }
    
            if(!req.file || !req.file.originalname){
                return res.status(400).json({erro : 'Imagem e obrigatoria'});
            }
    
            return res.status(200).json({erro : 'Publicação valida.'});

        }catch(e){
            console.log(e);
            return res.status(400).json({erro : 'Erro ao cadastrar publicação'});
        }
});

export const config = {
    api : {
        bodyParser : false
    }
}

export default validarTokenJWT(conectarMongoDB(handler));