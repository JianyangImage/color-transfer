
export function RgbToLab(R, G, B){
  let L = 0.3811*R + 0.5783*G + 0.0402*B;
  let M = 0.1967*R + 0.7244*G + 0.0782*B;
  let S = 0.0241*R + 0.1288*G + 0.8444*B;
  //若RGB值均为0，则LMS为0，防止数学错误log0
  if(L!==0) L = Math.log(L)/Math.log(10);
  if(M!==0) M = Math.log(M)/Math.log(10);
  if(S!==0) S = Math.log(S)/Math.log(10);
  return [(L + M + S)/Math.sqrt(3),(L + M - 2*S)/Math.sqrt(6),(L - M)/Math.sqrt(2)];
}

// export function abc() {
//   const aaaa = def();
//   return aaaa;
// }
// export function def() {
//   return 20;
// }
export function LabToRgb(l, a, b) {
  let rgb = new Array(3);
  l /= Math.sqrt(3);
  a /= Math.sqrt(6);
  b /= Math.sqrt(2);
  let L = l + a + b;
  let M = l + a - b;
  let S = l - 2*a;

  L = Math.pow(10,L);
  M = Math.pow(10,M);
  S = Math.pow(10,S);

  let dR = 4.4679*L - 3.5873*M + 0.1193*S;
  let dG = -1.2186*L + 2.3809*M - 0.1624*S;
  let dB = 0.0497*L - 0.2439*M + 1.2045*S;
  //防止溢出，若求得RGB值大于255则置为255，若小于0则置为0
  if (dR>255) rgb[0]=255;
  else if (dR<0) rgb[0]=0;
  else rgb[0] = dR;

  if (dG>255) rgb[1]=255;
  else if (dG<0) rgb[1]=0;
  else rgb[1] = dG;

  if (dB>255) rgb[2]=255;
  else if (dB<0) rgb[2]=0;
  else rgb[2] = dB;

  return rgb;
}

export function RgbToGray(r,g,b) {
  // var gray = parseInt(0.29900*r+0.58700*g+0.11400*b);
  let gray =parseInt(Math.pow((Math.pow(r,2.2)*0.2126+Math.pow(g,2.2)*0.7152+Math.pow(b,2)*0.0722),Math.pow(2.2,-1)));
  if(gray>255) gray = 255;
  if(gray<0) gray = 0;
  return gray;
}

export function  FCM(pixels,imgWidth,imgHeight,pixels2,imgWidth2,imgHeight2) {
  let pixels3 = new Array(imgWidth * imgHeight);
  let classnum=8;
  let m=2;
  let i,j,k,nindex;
  let l,a,b;
  let belong=new Array(imgWidth*imgHeight*classnum);
  let belong2=new Array(imgWidth2*imgHeight2*classnum);
  let center=new Array(classnum*4);
  let center2=new Array(classnum*4);
  let clustermap=new Array(classnum);
  let suml,suma,sumb;
  FCMCluster(pixels,imgWidth,imgHeight,belong,center,classnum,m);
  FCMCluster(pixels2,imgWidth2,imgHeight2,belong2,center2,classnum,m);
  //var vl=new Array(classnum);
  //var va=new Array(classnum);
  //var vb=new Array(classnum);
  //var vl2=new Array(classnum);
  //var va2=new Array(classnum);
  //var vb2=new Array(classnum);
  for(i = 0 ; i<classnum ; i++) {
    let distance=255;
    let map=-1;
    let r,g,b,r2,g2,b2;
    for(j=0;j<classnum;j++) {
      let rgb1 = LabToRgb(center[i*4],center[i*4+1],center[i*4+2]);
      r = rgb1[0];
      g = rgb1[1];
      b = rgb1[2];
      let rgb2 = LabToRgb(center2[j*4],center2[j*4+1],center2[j*4+2]);
      r2 = rgb2[0];
      g2 = rgb2[1];
      b2 = rgb2[2];
      let gray1 = RgbToGray(r,g,b);
      let gray2 = RgbToGray(r2,g2,b2);
      let dis=Math.abs(gray1-gray2);
      if (distance>dis) {distance=dis;map=j;}
    }
    clustermap[i]=map;
  }

//TranColor(belong,belong2,center,center2);
  //求各聚类域的标准差
  /*
  for(k=0;k<classnum;k++)
  {
      var sumu = 0;
      suml=suma=sumb=0;
      for(j = 0;j <imgHeight; j++)
      {
          for(i = 0; i <imgWidth; i++)
          {
              nindex=j*imgWidth+i;
              var lab = RgbToLab(pixels[nindex*4],pixels[nindex*4+1],pixels[nindex*4+2]);
              l = lab[0];
              a = lab[1];
              b = lab[2];
              suml+=Math.pow(belong[imgWidth*imgHeight*k+nindex],m)*Math.pow((l-center[k*4+0]),2);
              suma+=Math.pow(belong[imgWidth*imgHeight*k+nindex],m)*Math.pow((a-center[k*4+1]),2);
              sumb+=Math.pow(belong[imgWidth*imgHeight*k+nindex],m)*Math.pow((b-center[k*4+2]),2);
              sumu+=Math.pow(belong[imgWidth*imgHeight*k+nindex],m);
          }
      }
      vl[k]=Math.sqrt(suml/sumu);
      va[k]=Math.sqrt(suma/sumu);
      vb[k]=Math.sqrt(sumb/sumu);
  }

  for(k=0;k<classnum;k++)
  {
      suml=suma=sumb=0;
      for(j = 0;j <imgHeight2; j++)
      {
          for(i = 0; i <imgWidth2; i++)
          {
              nindex=j*imgWidth2+i;
              var lab = RgbToLab(pixels2[nindex*4],pixels2[nindex*4+1],pixels2[nindex*4+2]);
              l = lab[0];
              a = lab[1];
              b = lab[2];
              suml+=Math.pow(belong2[imgWidth2*imgHeight2*k+nindex],m)*Math.pow((l-center2[k*4+0]),2);
              suma+=Math.pow(belong2[imgWidth2*imgHeight2*k+nindex],m)*Math.pow((a-center2[k*4+1]),2);
              sumb+=Math.pow(belong2[imgWidth2*imgHeight2*k+nindex],m)*Math.pow((b-center2[k*4+2]),2);
              sumu+=Math.pow(belong2[imgWidth2*imgHeight2*k+nindex],m);
          }
      }
      vl2[k]=Math.sqrt(suml/sumu);
      va2[k]=Math.sqrt(suma/sumu);
      vb2[k]=Math.sqrt(sumb/sumu);
  }
*/
  //求结果图像的lab
  for (j = 0 ; j < imgHeight; j++) {
    for (i = 0; i < imgWidth; i++) {
      nindex = j * imgWidth + i;
      suml=suma=sumb=0;
      let lab = RgbToLab(pixels[nindex*4],pixels[nindex*4+1],pixels[nindex*4+2]);
      l = lab[0];
      a = lab[1];
      b = lab[2];
      for(k=0;k<classnum;k++) {
        //suml += belong[imgWidth*imgHeight*k+nindex]*((l - center[k*4]) * vl2[clustermap[k]/vl[k] + center2[clustermap[k]*4]] );
        //suma += belong[imgWidth*imgHeight*k+nindex]*((a - center[k*4+1]) * va2[clustermap[k]]/va[k] + center2[clustermap[k]*4+1]);
        //sumb += belong[imgWidth*imgHeight*k+nindex]*((b - center[k*4+2]) * vb2[clustermap[k]]/vb[k] + center2[clustermap[k]*4+2]);
        suml += belong[imgWidth*imgHeight*k+nindex]*center2[clustermap[k]*4];
        suma += belong[imgWidth*imgHeight*k+nindex]*center2[clustermap[k]*4+1];
        sumb += belong[imgWidth*imgHeight*k+nindex]*center2[clustermap[k]*4+2];
      }
      let rgb = LabToRgb(l,suma,sumb);
      pixels3[nindex*4] =rgb[0];
      pixels3[nindex*4+1] = rgb[1];
      pixels3[nindex*4+2] = rgb[2];
      pixels3[nindex*4+3] = pixels[nindex*4+3];
    }
  }
  return pixels3;
}






export function FCMCluster( pixels, imgWidth, imgHeight ,belong,center,classnum,m) {
  let i,j,l,nindex;//循环控制变量
  let k=0;
  let LOOP = 0;
  let center2=new Array(classnum*4);//聚类中心
  let x,y;//随机确定聚类中心坐标
  let num=new Array(classnum);//每个类的像素个数
  let lpImageLab = new  Array(imgWidth*imgHeight*4);
  let sumu,suml,suma,sumb;
  let dis = new Array(classnum)
  //初始化聚类中心
  for(i=0;i<classnum;i++) {
    x=parseInt(Math.random()*imgWidth,10);
    y=parseInt(Math.random()*imgHeight,10);
    nindex=((imgHeight-y-1)*imgWidth+x);
    let lab3 = RgbToLab(pixels[nindex*4],pixels[nindex*4+1],pixels[nindex*4+2]);
    center[i*4] = lab3[0];
    center[i*4+1] =lab3[1];
    center[i*4+2] = lab3[2];
    for(j=0;j<i;j++) {
      let dis=DistanceLab(center[i*4],center[i*4+1],center[i*4+2],center[j*4],center[j*4+1],center[j*4+2]);
      if(dis<0.2) {i--;break;}//限值公式 暂取限值为1待优化 对初始化聚类中心的选择非常关键
    }
  }
  //计算隶属度矩阵、更新聚类中心、直至前后聚类中心距离小于限值e暂定0.1待优化
  for( LOOP = 50 ; LOOP > 0 ; LOOP--)//限值公式
  {
    //计算隶属度矩阵
    for(j = 0;j <imgHeight; j++) {
      for(i = 0; i <imgWidth; i++) {
        nindex=j * imgWidth + i;
        let lab = RgbToLab(pixels[nindex*4],pixels[nindex*4+1],pixels[nindex*4+2]);
        lpImageLab[nindex*4] = lab[0];
        lpImageLab[nindex*4+1] = lab[1];
        lpImageLab[nindex*4+2] = lab[2];
        lpImageLab[nindex*4+3] = pixels[3];
        let blg=-1;//隶属度
        for(k=0;k<classnum;k++) {
          sumu=0;
          let dis1=DistanceLab(lpImageLab[nindex*4],lpImageLab[nindex*4+1],lpImageLab[nindex*4+2],center[k*4],center[k*4+1],center[k*4+2]);
          if (dis1===0) {belong[imgWidth*imgHeight*k+nindex]=1;continue;}
          for(l=0;l<classnum;l++) {
            let dis2=DistanceLab(lpImageLab[nindex*4],lpImageLab[nindex*4+1],lpImageLab[nindex*4+2],center[l*4],center[l*4+1],center[l*4+2]);
            if (dis2===0) {break;}
            sumu+=Math.pow((dis1*dis1)/(dis2*dis2),1.0/(m-1));
          }
          if (l!==classnum) {belong[imgWidth*imgHeight*k+nindex]=0;continue;}
          belong[imgWidth*imgHeight*k+nindex]=1/sumu;   // 每个点的隶属度
        }
      }
    }
    // 更新聚类中心
    for(k=0;k<classnum;k++) {
      suml=suma=sumb=sumu=0;
      for(j = 0;j <imgHeight; j++) {
        for(i = 0; i <imgWidth; i++) {
          nindex=j * imgWidth + i;
          suml+=Math.pow(belong[imgWidth*imgHeight*k+nindex],m)*lpImageLab[nindex*4];
          suma+=Math.pow(belong[imgWidth*imgHeight*k+nindex],m)*lpImageLab[nindex*4+1];
          sumb+=Math.pow(belong[imgWidth*imgHeight*k+nindex],m)*lpImageLab[nindex*4+2];
          sumu+=Math.pow(belong[imgWidth*imgHeight*k+nindex],m);
        }
      }
      center2[k*4]=suml/sumu;
      center2[k*4+1]=suma/sumu;
      center2[k*4+2]=sumb/sumu;
    }
    //判断循环终止条件
    for(i = 0;i<classnum;i++) {
      dis[i] = DistanceLab(center[i*4],center[i*4+1],center[i*4+2],center2[i*4],center2[i*4+1],center2[i*4+2]);
    }
    for (i = 0; i < classnum * 4; i++) {
      center[i] = center2[i];
    }
    let n = 0;
    for ( i = 0 ; i<classnum ;i++) {
      if(dis[i]<0.1) {
        n++;
      }// 限值e暂定0.1待优化
    }
    if (n === classnum) {
      break;
    }
  }
}

export function DistanceLab( l1, a1, b1, l2, a2, b2) {
  let lx=l1-l2;
  let ax=a1-a2;
  let bx=b1-b2;
  if (lx<0) lx=-lx;
  if (ax<0) ax=-ax;
  if (bx<0) bx=-bx;
  return lx+ax+bx;
}

