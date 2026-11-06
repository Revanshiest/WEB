<template>
  <div id="app">
    <!-- Шапка сайта -->
    <header>
      <div class="header-content">
        <h1>Нобелевский справочник</h1>
        <p>Лабораторная работа №2: Реактивность и SPA на Vue 3 + Vue Router</p>
      </div>
    </header>

    <!-- Навигация с использованием router-link -->
    <nav>
      <div class="nav-container">
        <router-link to="/prizes" class="nav-link">Нобелевские премии</router-link>
        <router-link to="/laureates" class="nav-link">Лауреаты премий</router-link>
      </div>
    </nav>

    <!-- Отображение текущего маршрута -->
    <main>
      <router-view />
    </main>

    <!-- Подвал сайта -->
    <footer>
      <p>&copy; 2025 Нобелевский справочник. Лабораторная работа №2 (Vue 3 + Composition API + Vite).</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Основной каркас приложения со слотом router-view
</script>

