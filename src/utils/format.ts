export const formatBRL = (n:number |null |undefined)=>{
    if(n==null) return '-';
    return new Intl.NumberFormat('en-US',{
        style:'currency',
        currency:'USD',
        maximumFractionDigits:2,
    }).format(n);
};

export const formatPercent = (n:number |null |undefined, dignits=2)=>{
    if(n==null ||Number.isNaN(n)) return '-';
    return `${n.toFixed(dignits)}%`;
};
