#ifndef __AFTER_INIT__
#define __AFTER_INIT__

#include "../aatg/lcd.h"

void Splash(); // Run this function to start the splash screen

const unsigned char Aini0[] = {
 					0b00000,
					0b00000,
					0b00000,
					0b00100, ///   #
					0b01110, ///  ###
					0b00100, ///   #
					0b00000,
					0b00000};
					
const unsigned char Aini1[] = { 
					0b00000,
					0b00000,
					0b00010, ///    #
					0b10100, /// # #
					0b01110, ///  ###
					0b00101, ///   # #
					0b01000, ///  #
					0b00000};

const unsigned char Aini2[] = { 
					0b00000,
					0b00000,
					0b00010, ///    #
					0b11110, /// ####
					0b01110, ///  ###
					0b01111, ///  ####
					0b01000, ///  #
					0b00000};

const unsigned char Aini3[] = { 
					0b00000,
					0b00000,
					0b01100, ///  ##
					0b01111, ///  ####
					0b11111, /// #####
					0b11110, /// ####
					0b00110, ///   ##
					0b00000};

const unsigned char Aini4[] = { 
					0b00000,
					0b00000,
					0b00010, ///    #
					0b11110, /// ####
					0b11110, /// ####
					0b01111, ///  ####
					0b01000, ///  #
					0b00000};

const unsigned char Aini5[] = { 
					0b00000,
					0b00000,
					0b00000,
					0b00000,
					0b00111, ///   ###
					0b00000,
					0b00000,
					0b00000};

const unsigned char Aini6[] = { 
					0b00000,
					0b00000,
					0b00000,
					0b00000,
					0b11111, /// #####
					0b00000,
					0b00000,
					0b00000};

const unsigned char Aini7[] = { 
					0b00000,
					0b00000,
					0b00000,
					0b00000,
					0b11100, /// ###
					0b00000,
					0b00000,
					0b00000};

struct animStep {
	int sprite;
	int posx;
	int posy;
};

struct animStep createStep(int sprite, int posx, int posy) {
	struct animStep foo = {sprite, posx, posy};
	return foo;
}

void Splash() {

	lcd_init();
	
	struct animStep anim[16];
	char name[3];

	lcd_set_char(0,(unsigned char*)Aini0);
	lcd_set_char(1,(unsigned char*)Aini1);
	lcd_set_char(2,(unsigned char*)Aini2);
	lcd_set_char(3,(unsigned char*)Aini3);
	lcd_set_char(4,(unsigned char*)Aini4);
	lcd_set_char(5,(unsigned char*)Aini5);
	lcd_set_char(6,(unsigned char*)Aini6);
	lcd_set_char(7,(unsigned char*)Aini7);

	int animLength = 13; 
	int i;
	
	anim[0]  = createStep(6,8,2);
	anim[1]  = createStep(6,8,2);
	anim[2]  = createStep(0,8,2);
	anim[3]  = createStep(1,8,2);
	anim[4]  = createStep(2,8,2);
	anim[5]  = createStep(3,8,2);
	anim[6]  = createStep(4,9,2);
	anim[7]  = createStep(3,10,2);
	anim[8]  = createStep(4,11,2);
	anim[9]  = createStep(3,12,2);
	anim[10] = createStep(1,12,2);
	anim[11] = createStep(0,12,2);
	anim[12] = createStep(7,12,2);

	name[0] = 'D';
	name[1] = 'L';
	name[2] = 'L';


	for(i = 0; i < animLength; i++) {
		if(i == 6) {
			lcd_gotoxy(i+2,2);
			_lcd_write_byte(5,1);
		}
		else if(i > 6 && i < 10) {
			lcd_gotoxy(i+2,2);
			_lcd_write_byte(6,1);
			lcd_gotoxy(i+2,1);
			_lcd_write_byte(name[i-7],1);
		}
		lcd_gotoxy(anim[i].posx,anim[i].posy);
		_lcd_write_byte(anim[i].sprite,1);
		_delay_ms(100);
	}

	_delay_ms(1000);
	lcd_clear();


}

#endif
