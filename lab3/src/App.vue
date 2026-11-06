<template>
  <div id="app">
    <!-- Шапка сайта -->
    <header>
      <div class="header-content">
        <h1>Нобелевский справочник</h1>
        <p>Лабораторная работа №3: Интеграция со сторонним API (Axios, пагинация, фильтрация)</p>
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
      <p>&copy; 2025 Нобелевский справочник. Лабораторная работа №3 (BaseApiService + Nobel Prize API).</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
</script>

