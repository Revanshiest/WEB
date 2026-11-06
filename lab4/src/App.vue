<template>
  <div id="app">
    <!-- Шапка сайта -->
    <header>
      <div class="header-content">
        <h1>Нобелевский справочник</h1>
        <p>Лабораторная работа №4: Строгая типизация API с помощью io-ts, fp-ts и decodeOrThrow</p>
      </div>
    </header>

    <!-- Навигация -->
    <nav>
      <div class="nav-container">
        <router-link to="/prizes" class="nav-link">Нобелевские премии</router-link>
        <router-link to="/laureates" class="nav-link">Лауреаты премий</router-link>
      </div>
    </nav>

    <!-- Основная часть -->
    <main>
      <router-view />
    </main>

    <!-- Подвал сайта -->
    <footer>
      <p>&copy; 2025 Нобелевский справочник. Лабораторная работа №4 (io-ts + fp-ts Either + decodeOrThrow).</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
</script>

