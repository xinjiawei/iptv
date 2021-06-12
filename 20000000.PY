
#-*- coding:utf-8 -*-
#用来加密及解密四川电信鉴权的3DES加密
from Crypto.Cipher import DES3
Authenticator = 'B1A04CCC2F3FE312CC55F7EAF11C8E81AD9CA18B998E13A0B30E008D411BCC74F605614615DE2484AE07D44EB53D775FCDDBDDD94C6A31429ED4975C881BFAC35490717C015244BDDF00FB0FC1C270DA9DBBC91172CA807A53FCD320DF0CE8068C57578115F251CB25971D1105BAAD9A95AF35C9664F4318561A422A4F88BED0'
#需要解密的字符串，即：Authenticator 值
#key的值，查找key时不需要输入
key = ''
BS = DES3.block_size
def pad(s):
    p =  s + (BS - len(s) % BS) * chr(BS - len(s) % BS)
    return p
def unpad(s):
    p =  s[0:-ord(s[-1])]
    return p
class prpcrypt(): #加密解密方法
    def __init__(self,key):
        self.key = key + '0'* (24-len(key))
        print('key：-- %s -- '%(self.key))
        self.mode = DES3.MODE_ECB
    def encrypt(self, text): #加密文本字符串,返回 HEX文本
        text = pad(text)
        cryptor = DES3.new(self.key, self.mode)
        x = len(text) % 8
        if x != 0:
            text = text + '\0' * (8 - x)
        self.ciphertext = cryptor.encrypt(text)
        return self.ciphertext.hex()
    def decrypt(self, text):
        cryptor = DES3.new(self.key, self.mode)
        de_text = bytes.fromhex(text)
        plain_text = cryptor.decrypt(de_text)
        return plain_text.replace(b'\x08',b'').decode('utf-8')
def find_key(text):
    keys = []
    print('开始测试000000-120000所有八位数字')
    for x in range(120000):
        if x % 500 == 0:
            print('已经搜索至：-- %s -- '%(x))
        pc = prpcrypt(str(x))
        try:
            e = pc.decrypt(text)  
            print('已经找到key:%s,解密后为:%s'%(x,e))
            keys.append(x)
        except Exception as e:
            pass
    print('解密完成！共查找到 %s 个密钥，分别为：%s'%(len(keys),keys))
#查找KEY
find_key(Authenticator)
#下面的用来解密
#pr = print(prpcrypt().decrypt(Authenticator))
