if(typeof jQuery=='undefined')FCLib$.fnLoadScript('https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js',true);

var bT$=(function(){
  "use strict"
  var aProds=[];
  var nSumProdPrices=0;
  var nSumOriProdPrices=0;
  
  var sCurrentPage=document.location.href.toUpperCase();

  /* Function to display formatted price */
  function fnFormatNumber(num){
    num=num.toString().replace(/\$|\,/g,'');
    if(isNaN(num))num="0";
    var sign=(num==(num=Math.abs(num)));
    num=Math.floor(num*100+0.50000000001);
    num=Math.floor(num/100).toString();
    for(var i=0;i<Math.floor((num.length-(1+i))/3);i++)num=num.substring(0,num.length-(4*i+3))+'.'+num.substring(num.length-(4*i+3));
    return ((sign)?'':'-')+num;
  }

  function fnShowEconomyConj(ProdPrice,ProdPriceOri){
    if(ProdPrice!=ProdPriceOri)document.write("<span class='FCfnShowEconomyConj'>"+ rk("details-buy-together-save") +" "+ FCLib$.formatMoney(ProdPriceOri-ProdPrice,FC$.Currency) +" (" +fnFormatNumber(((ProdPriceOri-ProdPrice)/ProdPriceOri)*100)+ "%)</span>");
  }

  function fnRemoveItemCJ(IDProd,oObj){
    var bTModel = document.querySelector('#bTContainer').getAttribute('data-bTModel');
    
    if(oObj.checked){
      
      if (bTModel==1){
        jQuery("#bTItem"+IDProd).animate({
          'opacity':'1'
        });
        jQuery('#bTProdSelect'+IDProd+' label').css('text-decoration','none');
      }
   
      else if(bTModel==3){
        jQuery("#bTItem"+IDProd).fadeIn(400);
        jQuery('#bTProdSelect'+IDProd+' label').css('text-decoration','none');
      }
    
    }else{
      if (bTModel==1) {
        jQuery("#bTItem"+IDProd).animate({
          'opacity':'0.5'
        });
        jQuery('#bTProdSelect'+IDProd+' label').css('text-decoration','none');        
      }
      else if(bTModel==3){
        jQuery("#bTItem"+IDProd).fadeOut(400);
        jQuery('#bTProdSelect'+IDProd+' label').css('text-decoration','line-through');
      }      
    }
    bT$.fnShowPrices();
  }

  function setVarProds(Obj){
    aProds[aProds.length]=Obj;
  }

  function fnShowPrices(){
    nSumProdPrices=0;
    nSumOriProdPrices=0; 
    var bTModel = document.querySelector('#bTContainer').getAttribute('data-bTModel');
    var bTemItem=false;
    if(typeof(aProds)=="object" && aProds.constructor==Array && aProds.length>0){
      for(var i=0;i<aProds.length;i++){
        var oProd=aProds[i];
        var bChecked=document.getElementById("CB"+oProd.id).checked;
        if(bChecked){
          nSumProdPrices=nSumProdPrices+oProd.PrecoNum;
          nSumOriProdPrices=nSumOriProdPrices+oProd.PrecoOri;
          bTemItem=true;
        }
      }
    }
    if(bTemItem){

      if(bTModel==3){
        document.getElementById("PricesCJ").style.display="block";
        document.querySelector(".bTItensContainer").style.display="block";
        document.querySelector(".bTTotalsPrices").style.display="block";
      }
      var nFinalPrice=0;
      if(nSumOriProdPrices==nSumProdPrices){
        nFinalPrice=""+ rk("details-buy-together-price") +": <p class='bTOriPrice'>"+ FCLib$.formatMoney(nSumProdPrices,FC$.Currency) +"</p>";
      }
      else{
        nFinalPrice=""+ rk("details-buy-together-price") +": "+ rk("details-buy-together-price-was") +" <strike>"+ FCLib$.formatMoney(nSumOriProdPrices,FC$.Currency) +"</strike><p class='bTPricePorCont'>"+ rk("details-buy-together-price-now") +" <span class='bTPricePor'>"+ FCLib$.formatMoney(nSumProdPrices,FC$.Currency) + "</span></p><span class='bTEconomy'>"+ rk("details-buy-together-save") +": " + FCLib$.formatMoney(nSumOriProdPrices-nSumProdPrices,FC$.Currency) +"</span>";
      }
      document.getElementById("idProdPrice").innerHTML=nFinalPrice;
    }
    else{
      if(bTModel==3){
        document.getElementById("PricesCJ").style.display="none";
        document.querySelector(".bTItensContainer, .bTActualItem").style.display="none";
        document.querySelector(".bTTotalsPrices").style.display="none";
      }
    }
  }

  function fnComprar(Obj){
    var aProdsComprar=[];
    if(typeof(aProds)=="object" && aProds.constructor==Array && aProds.length>0){
      for(var i=0;i<aProds.length;i++){
        var oProd=aProds[i];
        var bChecked=document.getElementById("CB"+oProd.id).checked;
        if(bChecked){
          aProdsComprar[aProdsComprar.length]=oProd;
        }
      }
      FCLib$.aBuyTogether=aProdsComprar;
      if(FC$.CartOnPage==0)FCLib$.addFormConjBuy(FC$.IDLoja,FCLib$.aBuyTogether);else FCLib$.addConjBuyCartOnPage(FC$.IDLoja,FCLib$.aBuyTogether,Obj);
    }
  }

  function fnMostraPrecoCJ(PrecoProd,PrecoOri){
    if(PrecoProd==PrecoOri){document.write(""+ rk("details-buy-together-price") +": <p class='bTOriPrice'>"+ FCLib$.formatMoney(PrecoProd,FC$.Currency) +"</p>");}
    else{
      document.write(""+ rk("details-buy-together-price") +": "+ rk("details-buy-together-price-was") +" <strike>"+ FCLib$.formatMoney(PrecoOri,FC$.Currency) +"</strike><p class='bTPricePorCont'>"+ rk("details-buy-together-price-now") +" <span class='bTPricePor'>"+ FCLib$.formatMoney(PrecoProd,FC$.Currency) + "</span></p><span class='bTEconomy'>"+ rk("details-buy-together-save") +" "+ FCLib$.formatMoney(PrecoOri-PrecoProd,FC$.Currency) +"</span>");
    }
  }

  function fnComprarCJ(id,Obj){
    var aProdsComprar=[];
    if(typeof(aProds)=="object" && aProds.constructor==Array && aProds.length>0){
      for(var i=0;i<aProds.length;i++){
        var oProd=aProds[i];
        if(oProd.id==id || oProd.id==IDProdPrincCJ){
          aProdsComprar[aProdsComprar.length]=oProd;
        }
      }
      FCLib$.aBuyTogether=aProdsComprar;
      if(FC$.CartOnPage==0)FCLib$.addFormConjBuy(FC$.IDLoja,FCLib$.aBuyTogether);else FCLib$.addConjBuyCartOnPage(FC$.IDLoja,FCLib$.aBuyTogether,Obj);
    }
  }

  return{
    fnFormatNumber:fnFormatNumber,
    fnShowEconomyConj:fnShowEconomyConj,
    fnRemoveItemCJ:fnRemoveItemCJ,
    fnShowPrices:fnShowPrices,
    setVarProds:setVarProds,
    fnComprar:fnComprar,
    fnMostraPrecoCJ:fnMostraPrecoCJ,
    fnComprarCJ:fnComprarCJ
  }

})();