@echo off
chcp 65001 > nul
title Меню запуска лабораторных работ по Веб-разработке

:menu
cls
echo ========================================================
echo     ЛАБОРАТОРНЫЕ РАБОТЫ ПО ВЕБ-РАЗРАБОТКЕ (2025)
echo ========================================================
echo.
echo  [1] Лабораторная работа №1 (HTML5 + CSS3 таблицы)
echo  [2] Лабораторная работа №2 (Vue 3 + Реактивность + Роутер)
echo  [3] Лабораторная работа №3 (Стороннее Nobel Prize API + Axios)
echo  [4] Лабораторная работа №4 (Строгая типизация: io-ts + fp-ts)
echo  [5] Лабораторная работа №5 (PWA + Service Worker + Офлайн-кеш)
echo  [6] Открыть руководство по проверке (README.md)
echo  [0] Выход
echo.
echo ========================================================
set /p choice="Выберите номер лабораторной для запуска (0-6): "

if "%choice%"=="1" goto lab1
if "%choice%"=="2" goto lab2
if "%choice%"=="3" goto lab3
if "%choice%"=="4" goto lab4
if "%choice%"=="5" goto lab5
if "%choice%"=="6" goto readme
if "%choice%"=="0" goto exit

echo Неверный выбор, попробуйте снова.
timeout /t 2 > nul
goto menu

:lab1
echo Запуск ЛР №1 в браузере...
start "" "%~dp0lab1\prizes.html"
goto menu

:lab2
echo Запуск dev-сервера ЛР №2 (порт 3000)...
cd /d "%~dp0lab2"
start http://localhost:3000
npm run dev
goto menu

:lab3
echo Запуск dev-сервера ЛР №3 (порт 3001)...
cd /d "%~dp0lab3"
start http://localhost:3001
npm run dev
goto menu

:lab4
echo Запуск dev-сервера ЛР №4 (порт 3002)...
cd /d "%~dp0lab4"
start http://localhost:3002
npm run dev
goto menu

:lab5
echo Запуск dev-сервера ЛР №5 (порт 3003)...
cd /d "%~dp0lab5"
start http://localhost:3003
npm run dev
goto menu

:readme
start "" notepad "%~dp0README.md"
goto menu

:exit
exit

