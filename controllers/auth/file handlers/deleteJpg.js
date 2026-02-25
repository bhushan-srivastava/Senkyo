
import fs from 'fs';

const deleteFolder = (dir) => {
  fs.rm(dir, { recursive: true, force: true }, (err) => {
    if (err) {
      console.error(`Error deleting ${dir}:`, err);
    }
  });
}

export default deleteFolder; 
