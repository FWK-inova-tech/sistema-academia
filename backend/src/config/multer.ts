import multer from 'multer';
import path from 'path';

// Configuração para upload de arquivos temporários
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Usando diretório temporário do sistema
    cb(null, 'uploads/temp/');
  },
  filename: (req, file, cb) => {
    // Gera nome único para evitar conflitos
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'import-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtro para aceitar apenas arquivos Excel e CSV
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel', // .xls
    'text/csv' // .csv
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não suportado. Use apenas .xlsx, .xls ou .csv'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB máximo
  }
});

export default upload;