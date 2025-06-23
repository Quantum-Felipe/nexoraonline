// Função auxiliar para formatar as tags
function formatarTag(tag) {
  return tag
    .trim()
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .replace(/\s+/g, "") // remove espaços
    .replace(/[^\w-]/g, ""); // remove caracteres especiais
}

// Função auxiliar para gerar texto alternativo SEO-friendly
function gerarAltText(nomeProduto, categoria) {
  return `Compre ${nomeProduto} - ${categoria} - Produto Original com Garantia - Entrega Rápida.`;
}

// Função para renderizar estrelas com base na nota (ex: 4.5)
function renderStars(rating) {
  let html = '';
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  for (let i = 0; i < fullStars; i++) {
    html += "<i class='bx bxs-star' style='color:#FFC107'></i>";
  }
  if (hasHalf) {
    html += "<i class='bx bxs-star-half' style='color:#FFC107'></i>";
  }
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);
  for (let i = 0; i < emptyStars; i++) {
    html += "<i class='bx bx-star' style='color:#FFC107'></i>";
  }
  return html;
}

// Função para criar o skeleton loading
function criarSkeletonLoading() {
  return `
    <div class="produto-card skeleton">
      <div class="product-image-container skeleton-image"></div>
      <div class="produto-info">
        <div class="name-of-p skeleton-text"></div>
        <div class="rating skeleton-text"></div>
        <div class="price-container">
          <div class="skeleton-text"></div>
          <div class="skeleton-text"></div>
          <div class="skeleton-text"></div>
        </div>
        <div class="skeleton-button"></div>
      </div>
    </div>
  `;
}

// Função para mostrar loading em cada container
function mostrarLoading(container) {
  const skeletons = Array(4).fill(criarSkeletonLoading()).join("");
  container.innerHTML = skeletons;
}

async function carregarProdutos() {
  // 1. Tenta carregar do cache
  let produtos = null;
  const cache = sessionStorage.getItem('produtos');
  if (cache) {
    try {
      produtos = JSON.parse(cache);
      renderizarProdutos(produtos, true); // true = do cache
    } catch (e) { /* ignora erro de parse */ }
  }

  // 2. Mostra skeleton se não tem cache
  if (!produtos) {
    document.querySelectorAll('[id^="produtos-"]').forEach((container) => {
      mostrarLoading(container);
    });
  }

  // 3. Busca do servidor (sempre faz, para atualizar)
  try {
    const url =
      "https://script.google.com/macros/s/AKfycbyuAxTGpRMoeMDSUUFWrSTcBlSAdIUGkeSI9zQusNfWW-FFu8IKQQ246nORdlHcX-G6Bg/exec"; //SUBSTITUIR_PELA_SUA_URL_APPS_SCRIPT
    const resposta = await fetch(url);
    const produtosFresh = await resposta.json();
    sessionStorage.setItem('produtos', JSON.stringify(produtosFresh));
    renderizarProdutos(produtosFresh, false);
  } catch (e) {
    // erro de rede, mantém cache se existir
  }
}

function renderizarProdutos(produtos, doCache) {
  try {
    // Agrupa produtos por categoria
    const categorias = {};
    produtos.forEach((produto) => {
      if (!categorias[produto.categoria]) categorias[produto.categoria] = [];
      categorias[produto.categoria].push(produto);
    });

  // Para cada categoria, insere os produtos no container correspondente
  Object.keys(categorias).forEach((categoria) => {
    const container = document.getElementById("produtos-" + categoria);
    if (!container) return;

    // Carrega os produtos em chunks para melhor performance
    const chunkSize = 4;
    const produtosChunks = [];
    for (let i = 0; i < categorias[categoria].length; i += chunkSize) {
      produtosChunks.push(categorias[categoria].slice(i, i + chunkSize));
    }

    // Função para renderizar um chunk de produtos
    const renderizarChunk = (chunk, index) => {
      setTimeout(() => {
        const produtosHTML = chunk
          .map((produto) => {
            // nome_produto e preco_atual são obrigatórios
            if (!produto.nome_produto || !produto.preco_atual) return "";
            return `
            <div class="produto-card">
              <div class="product-image-container">
                  <img src="${
                    produto.imagem ||
                    "https://via.placeholder.com/300x200?text=Sem+Imagem"
                  }" 
                       alt="${gerarAltText(
                         produto.nome_produto,
                         produto.categoria
                       )}" 
                       title="${produto.nome_produto}"
                       class="product-image"
                       loading="lazy">
                </div>
                <div class="produto-info">
                  <div class="name-of-p"><p>${produto.nome_produto}</p></div>
                  ${
                    produto.estrelas || produto.avaliacoes
                      ? `
                  <div class="rating">
                    ${produto.estrelas ? renderStars(produto.estrelas) : ''}
                    ${produto.avaliacoes ? `<span class="rating-count">(${produto.avaliacoes})</span>` : ''}
                  </div>`
                      : ""
                  }
                  <div class="price-container">
                    ${
                      (() => {
                        function parsePrecoBR(valor) {
                          if (!valor) return 0;
                          if (typeof valor === 'number') return valor;
                          return Number(
                            valor
                              .replace(/[^\d,.-]/g, '')
                              .replace(/\./g, '')
                              .replace(',', '.')
                          ) || 0;
                        }
                        const precoAntigo = parsePrecoBR(produto.preco_antigo);
                        return precoAntigo > 0
                          ? `<div class="old-price">De: <span>${precoAntigo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span></div>`
                          : "";
                      })()
                    }
                    <div class="current-price">
                      <span class="price-label">Por:</span>
                      <span class="price">${Number(produto.preco_atual).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    </div>
                    ${
                      produto.parcelamento
                        ? `<div class="installment${/sem\s+juros/i.test(produto.parcelamento) ? ' sem-juros' : ' com-juros'}">${produto.parcelamento}</div>`
                        : ""
                    }
                    ${
                      (() => {
                        function parseEconomia(economia) {
                          if (!economia) return 0;
                          if (typeof economia === 'number') return economia;
                          // Remove "R$", espaços, remove pontos (milhar) e troca vírgula decimal por ponto
                          const clean = economia
                            .replace(/[^\d,.-]/g, '') // mantém dígitos, vírgula, ponto, menos
                            .replace(/\./g, '')       // remove todos os pontos (milhar)
                            .replace(',', '.');        // troca vírgula decimal por ponto
                          const num = Number(clean);
                          return isNaN(num) ? 0 : num;
                        }
                        const valorEconomia = parseEconomia(produto.economia);
                        return valorEconomia > 0 ? `
                          <div class="savings-tag">
                            <span class="savings-icon">&#128176;</span>
                            <span class="savings-text">Economia de <strong>${valorEconomia.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong></span>
                          </div>` : "";
                      })()
                    }
                    ${
                      produto.link_produto
                        ? `
                    <div class="product-details-link">
                      <a href="${produto.link_produto}" target="_blank" class="product-details-link-btn"
                        data-product-name="${produto.nome_produto}" data-product-price="${produto.preco_atual}">
                        <i class='bx bx-info-circle'></i> Saber mais sobre o produto
                      </a>
                    </div>`
                        : ""
                    }
                  </div>
                  ${
                    produto.link_comprar
                      ? `
                  <div class="buy-now">
                    <button class="buy-now-btn" data-product-name="${produto.nome_produto}" data-product-price="${produto.preco_atual}">
                      <a href="${produto.link_comprar}" target="_blank">COMPRAR AGORA</a>
                    </button>
                  </div>`
                      : ""
                  }
                  ${
                    produto.tags
                      ? `
                  <div class="product-tags">
                    ${produto.tags
                      .split(",")
                      .map((tag) => {
                        const tagFormatada = formatarTag(tag);
                        return `<span class="tag ${tagFormatada}" title="${tag.trim()}">${tag.trim()}</span>`;
                      })
                      .join("")}
                  </div>`
                      : ""
                  }
                  ${
                    produto.data_info
                      ? (() => {
                        const data = new Date(produto.data_info);
                        const dia = String(data.getDate()).padStart(2, '0');
                        const mes = String(data.getMonth() + 1).padStart(2, '0');
                        const ano = data.getFullYear();
                        return `<p class="info-ref-tag">*Informações referente ao dia ${dia}/${mes}/${ano}</p>`;
                      })()
                        : ""
                  }
                </div>
              </div>
            `;
            })
            .join("");

          if (index === 0) {
            container.innerHTML = produtosHTML;
          } else {
            container.insertAdjacentHTML("beforeend", produtosHTML);
          }

          // Adiciona a classe .loaded quando a imagem carregar
          container
            .querySelectorAll("img.product-image:not(.loaded)")
            .forEach((img) => {
              img.addEventListener("load", function () {
                this.classList.add("loaded");
              });
              img.addEventListener("error", function () {
                this.src =
                  "https://via.placeholder.com/300x200?text=Imagem+Indisponivel";
                this.classList.add("loaded");
              });
              // Se a imagem já estiver em cache
              if (img.complete) {
                img.classList.add("loaded");
              }
            });
        }, index * 200); // Delay de 200ms entre cada chunk
      };

      // Renderiza cada chunk com um pequeno delay
      produtosChunks.forEach((chunk, index) => renderizarChunk(chunk, index));
    });
  } catch (erro) {
    console.error("Erro ao carregar produtos:", erro);
    document.querySelectorAll('[id^="produtos-"]').forEach((container) => {
      container.innerHTML =
        '<div class="erro-carregamento">Erro ao carregar produtos. Por favor, tente novamente.</div>';
    });
  }
}
// Chama a função ao carregar a página
document.addEventListener("DOMContentLoaded", carregarProdutos);

function gerarJSONLDProdutos(produtos) {
  const productsLD = produtos
    .filter(p => p.nome_produto && p.preco_atual)
    .map(p => {
      // Monta objeto Product
      const prod = {
        "@type": "Product",
        "productID": p.id || p.nome_produto.replace(/\s+/g, "_").toLowerCase(),
        "name": p.nome_produto,
        "description": p.descricao || p.nome_produto,
        "category": p.categoria,
        "image": p.imagem,
        "brand": p.marca ? { "@type": "Brand", "name": p.marca } : undefined,
        "sku": p.sku,
        "gtin13": p.gtin13 || p.ean || p.gtin,
        "releaseDate": p.data_lancamento,
        "color": p.cor,
        "material": p.material,
        "size": p.tamanho,
        "weight": p.peso,
        "offers": {
          "@type": "Offer",
          "url": p.link_produto || window.location.href,
          "priceCurrency": "BRL",
          "price": String(p.preco_atual),
          "availability": p.disponivel ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          "priceValidUntil": p.preco_valido_ate,
          "itemCondition": p.condicao ? `https://schema.org/${p.condicao}` : "https://schema.org/NewCondition",
          "seller": p.loja ? { "@type": "Organization", "name": p.loja } : undefined
        },
        "aggregateRating": (p.estrelas && p.avaliacoes) ? {
          "@type": "AggregateRating",
          "ratingValue": String(p.estrelas),
          "reviewCount": String(p.avaliacoes)
        } : undefined,
        "review": Array.isArray(p.reviews) ? p.reviews.map(r => ({
          "@type": "Review",
          "author": r.autor,
          "datePublished": r.data,
          "reviewBody": r.texto,
          "reviewRating": r.nota ? {
            "@type": "Rating",
            "ratingValue": String(r.nota),
            "bestRating": "5",
            "worstRating": "1"
          } : undefined
        })) : undefined
      };

      // Remove campos undefined e arrays vazios
      Object.keys(prod).forEach(key => {
        if (prod[key] === undefined || (Array.isArray(prod[key]) && prod[key].length === 0)) delete prod[key];
      });
      // Limpa offers
      Object.keys(prod.offers).forEach(key => prod.offers[key] === undefined && delete prod.offers[key]);
      // Limpa brand, aggregateRating, review
      if (prod.brand && prod.brand.name === undefined) delete prod.brand;
      if (prod.aggregateRating && (!prod.aggregateRating.ratingValue || !prod.aggregateRating.reviewCount)) delete prod.aggregateRating;
      if (prod.review && prod.review.length === 0) delete prod.review;
      return prod;
    });

  const jsonld = {
    "@context": "https://schema.org",
    "@graph": productsLD
  };

  document.querySelectorAll('script[type="application/ld+json"].produtos-jsonld').forEach(s => s.remove());
  const script = document.createElement('script');
  script.type = "application/ld+json";
  script.className = "produtos-jsonld";
  script.text = JSON.stringify(jsonld, null, 2);
  document.head.appendChild(script);
}
