
import fs from 'fs';

let deleteFolder = (dir) => {
  fs.rm(dir, { recursive: true, force: true }, err => {
    if (err) {
      throw err;
    }
    console.log(`${dir} is deleted!`);
  });
}

export default deleteFolder; 
